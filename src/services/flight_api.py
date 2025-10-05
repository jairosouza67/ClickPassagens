"""
Serviço para integração com APIs de voos reais
Suporta Amadeus, SkyScanner e outras APIs
"""
import os
import requests
import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from flask import current_app, has_app_context
from decouple import config
from src.models.milhas import db, AmadeusRateLimitLog


def _str_to_bool(value: Optional[str], default: bool = False) -> bool:
    """Converte strings de configuração em booleano."""
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {'1', 'true', 'yes', 'on'}


def _log(level: str, message: str, exc_info: bool = False):
    """Helper para logging que funciona dentro e fora do contexto Flask"""
    if has_app_context():
        logger = current_app.logger
        getattr(logger, level)(message, exc_info=exc_info)
    else:
        logger = logging.getLogger(__name__)
        getattr(logger, level)(message, exc_info=exc_info)


class FlightAPIService:
    def __init__(self):
        # Credenciais padrão para Render (plano gratuito tem limite de env vars)
        # IMPORTANTE: Em produção real, use variáveis de ambiente!
        default_key = 'cppo2FiXfoOVQ7jyggpCKl0fG8NYH1Pu'
        default_secret = 'AQlRGZdG1Qm3y74f'
        
        self.amadeus_api_key = config('AMADEUS_API_KEY', default=default_key)
        self.amadeus_api_secret = config('AMADEUS_API_SECRET', default=default_secret)
        self.skyscanner_api_key = config('SKYSCANNER_API_KEY', default='')
        self.amadeus_base_url = config('AMADEUS_BASE_URL', default='https://test.api.amadeus.com')
        self.amadeus_token = None
        self.amadeus_token_expiration = None
        self.mode = config('FLIGHT_API_MODE', default='production').lower()
        self.rate_limit_alert_threshold = int(config('AMADEUS_RATE_LIMIT_ALERT_THRESHOLD', default='100'))

        allow_fallback_default = 'false' if self.mode in {'production', 'real', 'live'} else 'true'
        self.allow_fallback = _str_to_bool(
            config('FLIGHT_API_ALLOW_FALLBACK', default=allow_fallback_default),
            default=allow_fallback_default.lower() in {'1', 'true', 'yes', 'on'}
        )
        
    def get_amadeus_token(self) -> Optional[str]:
        """Obtém token de acesso da API Amadeus"""
        if not self.amadeus_api_key or not self.amadeus_api_secret:
            _log('error', "Credenciais Amadeus não configuradas")
            return None

        if (
            self.amadeus_token
            and self.amadeus_token_expiration
            and datetime.utcnow() < self.amadeus_token_expiration
        ):
            _log('debug', "Usando token Amadeus em cache")
            return self.amadeus_token
            
        url = f"{self.amadeus_base_url}/v1/security/oauth2/token"
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        data = {
            'grant_type': 'client_credentials',
            'client_id': self.amadeus_api_key,
            'client_secret': self.amadeus_api_secret
        }
        
        try:
            _log('info', f"Solicitando novo token Amadeus de {url}")
            response = requests.post(url, headers=headers, data=data, timeout=10)
            _log('info', f"Token Response Status: {response.status_code}")
            
            if response.status_code == 200:
                token_data = response.json()
                self.amadeus_token = token_data.get('access_token')
                expires_in = token_data.get('expires_in')
                if expires_in:
                    try:
                        self.amadeus_token_expiration = datetime.utcnow() + timedelta(seconds=int(expires_in) - 60)
                    except (TypeError, ValueError):
                        self.amadeus_token_expiration = None
                _log('info', f"Token Amadeus obtido com sucesso (expira em {expires_in}s)")
                return self.amadeus_token
            else:
                _log('error', f"Erro ao obter token: {response.status_code} - {response.text[:200]}")
        except Exception as e:
            _log('error', f"Erro ao obter token Amadeus: {e}", exc_info=True)
        
        return None
    
    def search_flights_amadeus(self, origem: str, destino: str, data_ida: str, 
                              data_volta: str = None, passageiros: int = 1) -> List[Dict]:
        """Busca voos usando a API Amadeus com suporte a branded fares e loyalty programs"""
        if not self.get_amadeus_token():
            _log('error', "Falha ao obter token Amadeus")
            return []
        
        url = f"{self.amadeus_base_url}/v2/shopping/flight-offers"
        headers = {
            'Authorization': f'Bearer {self.amadeus_token}'
        }
        
        params = {
            'originLocationCode': origem,
            'destinationLocationCode': destino,
            'departureDate': data_ida,
            'adults': passageiros,
            'max': 20,  # Máximo de resultados
            'currencyCode': 'BRL'
        }
        
        if data_volta:
            params['returnDate'] = data_volta
        
        try:
            _log('info', f"Chamando Amadeus API: {origem} -> {destino} em {data_ida}")
            response = requests.get(url, headers=headers, params=params, timeout=30)
            self._log_rate_limit(response.headers, endpoint='flight-offers', status_code=response.status_code)
            
            _log('info', f"Amadeus Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                _log('info', f"Amadeus Response Data: {len(data.get('data', []))} offers encontradas")
                resultados = self.parse_amadeus_response(data)
                _log('info', f"Parse resultou em {len(resultados)} voos")
                return resultados
            else:
                _log('error', f"Amadeus API retornou status {response.status_code}: {response.text[:500]}")
        except Exception as e:
            _log('error', f"Erro na busca Amadeus: {e}", exc_info=True)
        
        return []
    
    def parse_amadeus_response(self, data: Dict) -> List[Dict]:
        """Converte resposta da Amadeus para formato interno com cálculo inteligente de milhas"""
        resultados = []
        
        if 'data' not in data:
            _log('warning', "Resposta Amadeus sem campo 'data'")
            return resultados
        
        _log('info', f"Iniciando parse de {len(data['data'])} ofertas")
        
        for idx, offer in enumerate(data['data']):
            try:
                itinerary = offer['itineraries'][0]  # Primeira parte da viagem
                segment = itinerary['segments'][0]   # Primeiro segmento
                
                # Informações da companhia
                carrier_code = segment['carrierCode']
                companhia_nome = self.get_airline_name(carrier_code)
                
                # Horários
                departure = segment['departure']
                arrival = segment['arrival']
                
                # Preço em dinheiro
                price_info = offer['price']
                preco = float(price_info['total'])
                
                # Calcular distância aproximada (se disponível nos metadados)
                route_distance = 0  # Pode ser extraído de dictionaries da Amadeus se disponível
                
                # Usar método inteligente para calcular milhas
                miles_data = self.calculate_miles_price(preco, carrier_code, route_distance)
                
                # Obter informações do programa de fidelidade
                loyalty_info = self.get_loyalty_program_info(carrier_code)
                
                resultado = {
                    'companhia': {
                        'id': None,
                        'nome': companhia_nome,
                        'codigo': carrier_code,
                        'logo_url': f"https://images.kiwi.com/airlines/64/{carrier_code}.png",
                        'ativa': True,
                        'valor_milheiro': loyalty_info['miles_value'],
                        'comissao_percentual': 3.0
                    },
                    'voo_numero': segment['number'],
                    'horario_saida': departure['at'].split('T')[1][:5],
                    'horario_chegada': arrival['at'].split('T')[1][:5],
                    'milhas_necessarias': miles_data['estimated_miles'],
                    'preco_dinheiro': preco,
                    'economia_calculada': miles_data['savings'],
                    'taxas_milhas': miles_data['tax_fees'],
                    'custo_total_milhas': miles_data['total_cost'],
                    'paradas': 'Direto' if len(itinerary['segments']) == 1 else f"{len(itinerary['segments']) - 1} parada(s)",
                    'disponivel': True,
                    'origem': departure['iataCode'],
                    'destino': arrival['iataCode'],
                    'duracao': itinerary['duration'],
                    # Novos campos para indicar confiabilidade
                    'preco_real_milhas': miles_data['is_real_price'],
                    'nivel_confianca': miles_data['confidence_level'],
                    'programa_fidelidade': miles_data['loyalty_program'],
                    'metodo_calculo': miles_data['calculation_method']
                }
                
                resultados.append(resultado)
                _log('debug', f"Oferta {idx+1} processada com sucesso: {carrier_code} {segment['number']}")
                
            except Exception as e:
                _log('error', f"Erro ao processar oferta {idx+1}: {e}", exc_info=True)
                continue
        
        _log('info', f"Parse concluído: {len(resultados)} voos processados com sucesso")
        return resultados
    
    def get_airline_name(self, carrier_code: str) -> str:
        """Retorna nome da companhia baseado no código IATA"""
        airlines = {
            'G3': 'Gol',
            'AD': 'Azul',
            'LA': 'LATAM',
            'AV': 'Avianca',
            'IB': 'Ibéria',
            'TP': 'TAP',
            'AF': 'Air France',
            'KL': 'KLM',
            'LH': 'Lufthansa',
            'BA': 'British Airways',
            'AA': 'American Airlines',
            'DL': 'Delta',
            'UA': 'United',
            'AC': 'Air Canada',
            'AM': 'Aeromexico',
            'CM': 'Copa Airlines',
            'AR': 'Aerolineas Argentinas'
        }
        return airlines.get(carrier_code, f"Companhia {carrier_code}")
    
    def get_loyalty_program_info(self, carrier_code: str) -> Dict:
        """Retorna informações do programa de fidelidade da companhia"""
        loyalty_programs = {
            'G3': {
                'program': 'Smiles',
                'miles_value': 20.0,  # R$ por 1000 milhas
                'has_api': False,
                'estimation_method': 'market_rate'
            },
            'AD': {
                'program': 'TudoAzul',
                'miles_value': 22.0,
                'has_api': False,
                'estimation_method': 'market_rate'
            },
            'LA': {
                'program': 'LATAM Pass',
                'miles_value': 25.0,
                'has_api': False,
                'estimation_method': 'market_rate'
            },
            'AV': {
                'program': 'LifeMiles',
                'miles_value': 18.0,
                'has_api': False,
                'estimation_method': 'market_rate'
            },
            'TP': {
                'program': 'TAP Miles&Go',
                'miles_value': 24.0,
                'has_api': False,
                'estimation_method': 'market_rate'
            },
            'AF': {
                'program': 'Flying Blue',
                'miles_value': 23.0,
                'has_api': False,
                'estimation_method': 'market_rate'
            },
            'AA': {
                'program': 'AAdvantage',
                'miles_value': 26.0,
                'has_api': False,
                'estimation_method': 'market_rate'
            },
            'DL': {
                'program': 'SkyMiles',
                'miles_value': 25.0,
                'has_api': False,
                'estimation_method': 'market_rate'
            },
            'UA': {
                'program': 'MileagePlus',
                'miles_value': 24.0,
                'has_api': False,
                'estimation_method': 'market_rate'
            }
        }
        return loyalty_programs.get(carrier_code, {
            'program': 'Programa de Milhas',
            'miles_value': 22.0,
            'has_api': False,
            'estimation_method': 'average'
        })
    
    def calculate_miles_price(self, cash_price: float, carrier_code: str, route_distance: int = 0) -> Dict:
        """
        Calcula preço em milhas baseado em múltiplas fontes
        Retorna dict com preço estimado e nível de confiabilidade
        """
        loyalty_info = self.get_loyalty_program_info(carrier_code)
        
        # Método 1: Conversão baseada no valor do milheiro
        miles_from_market = (cash_price / loyalty_info['miles_value']) * 1000
        
        # Método 2: Baseado na distância (se disponível)
        # Rotas curtas: ~12-15k milhas, Médias: ~20-30k, Longas: ~40-70k
        miles_from_distance = 0
        confidence = 'medium'
        
        if route_distance > 0:
            if route_distance < 500:  # Curta
                miles_from_distance = 12000 + (route_distance * 5)
                confidence = 'high'
            elif route_distance < 2000:  # Média
                miles_from_distance = 20000 + (route_distance * 7)
                confidence = 'high'
            else:  # Longa
                miles_from_distance = 40000 + (route_distance * 8)
                confidence = 'high'
        
        # Usar média ponderada se tivermos distância
        if miles_from_distance > 0:
            estimated_miles = int((miles_from_market * 0.6) + (miles_from_distance * 0.4))
        else:
            estimated_miles = int(miles_from_market)
            confidence = 'low'
        
        # Calcular economia (taxas geralmente são ~10-15% do valor em dinheiro)
        tax_fees = cash_price * 0.12
        miles_cost = (estimated_miles / 1000) * loyalty_info['miles_value']
        total_cost_with_miles = miles_cost + tax_fees
        savings = cash_price - total_cost_with_miles
        
        return {
            'estimated_miles': estimated_miles,
            'tax_fees': round(tax_fees, 2),
            'total_cost': round(total_cost_with_miles, 2),
            'savings': round(savings, 2),
            'confidence_level': confidence,
            'is_real_price': False,  # Sempre False até termos API real
            'loyalty_program': loyalty_info['program'],
            'miles_value': loyalty_info['miles_value'],
            'calculation_method': 'market_rate_based'
        }
    
    # REMOVIDO: Método search_flights_fallback() - Não usamos mais dados simulados!
    # Agora buscamos em datas próximas quando não encontramos voos na data solicitada.
    
    def search_nearby_dates(self, origem: str, destino: str, data_ida: str, 
                           data_volta: str = None, passageiros: int = 1, dias_range: int = 3) -> Dict:
        """Busca voos na data solicitada e em datas próximas se não encontrar"""
        _log('info', f"Iniciando busca inteligente: {origem} -> {destino} em {data_ida}")
        
        # Converte data para datetime
        try:
            data_base = datetime.strptime(data_ida, '%Y-%m-%d')
        except ValueError:
            _log('error', f"Data inválida: {data_ida}")
            return {
                'data_solicitada': data_ida,
                'voos_encontrados': False,
                'resultados': [],
                'datas_alternativas': [],
                'mensagem': 'Data inválida. Use o formato YYYY-MM-DD.'
            }
        
        # Primeira tentativa: data solicitada
        resultados_data_original = self.search_flights_amadeus(origem, destino, data_ida, data_volta, passageiros)
        
        if resultados_data_original:
            _log('info', f"Voos encontrados na data solicitada: {len(resultados_data_original)}")
            return {
                'data_solicitada': data_ida,
                'voos_encontrados': True,
                'resultados': resultados_data_original,
                'datas_alternativas': [],
                'mensagem': f'{len(resultados_data_original)} voos encontrados para a data solicitada.'
            }
        
        # Não encontrou: buscar em datas próximas
        _log('info', f"Nenhum voo encontrado em {data_ida}. Buscando datas próximas...")
        datas_alternativas = []
        
        # Gerar range de datas (±dias_range)
        for offset in range(-dias_range, dias_range + 1):
            if offset == 0:  # Já tentamos a data original
                continue
            
            data_alternativa = data_base + timedelta(days=offset)
            data_alternativa_str = data_alternativa.strftime('%Y-%m-%d')
            
            # Buscar voos nesta data alternativa
            _log('info', f"Tentando data alternativa: {data_alternativa_str}")
            resultados_alt = self.search_flights_amadeus(origem, destino, data_alternativa_str, data_volta, passageiros)
            
            if resultados_alt:
                datas_alternativas.append({
                    'data': data_alternativa_str,
                    'dia_semana': data_alternativa.strftime('%A'),
                    'diferenca_dias': offset,
                    'quantidade_voos': len(resultados_alt),
                    'preco_minimo': min(voo['preco_dinheiro'] for voo in resultados_alt),
                    'resultados': resultados_alt
                })
                _log('info', f"Encontrados {len(resultados_alt)} voos em {data_alternativa_str}")
        
        if datas_alternativas:
            # Ordenar por diferença de dias (mais próximo primeiro)
            datas_alternativas.sort(key=lambda x: abs(x['diferenca_dias']))
            
            melhor_data = datas_alternativas[0]
            mensagem = f"Não encontramos voos para {data_ida}, mas encontramos {melhor_data['quantidade_voos']} voos em {melhor_data['data']} ({melhor_data['diferenca_dias']:+d} dias)."
            
            return {
                'data_solicitada': data_ida,
                'voos_encontrados': False,
                'resultados': [],
                'datas_alternativas': datas_alternativas,
                'melhor_alternativa': melhor_data,
                'mensagem': mensagem
            }
        
        # Não encontrou em nenhuma data
        _log('warning', f"Nenhum voo encontrado em {origem} -> {destino} nas datas próximas a {data_ida}")
        return {
            'data_solicitada': data_ida,
            'voos_encontrados': False,
            'resultados': [],
            'datas_alternativas': [],
            'mensagem': f'Nenhum voo disponível de {origem} para {destino} entre {(data_base - timedelta(days=dias_range)).strftime("%d/%m")} e {(data_base + timedelta(days=dias_range)).strftime("%d/%m")}. Tente outra rota ou período.'
        }
    
    def search_flights(self, origem: str, destino: str, data_ida: str, 
                      data_volta: str = None, passageiros: int = 1) -> List[Dict]:
        """Método principal para busca de voos - SOMENTE DADOS REAIS"""
        _log('info', f"Buscando voos reais: {origem} -> {destino} em {data_ida}")
        _log('info', f"Modo: {self.mode}, Allow Fallback: {self.allow_fallback}")

        if not self.amadeus_api_key or not self.amadeus_api_secret:
            _log('error', "Credenciais Amadeus NÃO configuradas!")
            raise RuntimeError(
                "Credenciais da API Amadeus não configuradas. "
                "Configure AMADEUS_API_KEY e AMADEUS_API_SECRET no arquivo .env para buscar voos reais."
            )

        # Busca inteligente em datas próximas
        resultado_busca = self.search_nearby_dates(origem, destino, data_ida, data_volta, passageiros)
        
        if resultado_busca['voos_encontrados']:
            return resultado_busca['resultados']
        
        # Se tem datas alternativas, retorna a melhor
        if resultado_busca.get('melhor_alternativa'):
            _log('info', f"Retornando voos da melhor data alternativa: {resultado_busca['melhor_alternativa']['data']}")
            # Adicionar flag indicando que é data alternativa
            for voo in resultado_busca['melhor_alternativa']['resultados']:
                voo['data_alternativa'] = resultado_busca['melhor_alternativa']['data']
                voo['data_original'] = data_ida
                voo['diferenca_dias'] = resultado_busca['melhor_alternativa']['diferenca_dias']
            
            return resultado_busca['melhor_alternativa']['resultados']
        
        # Não encontrou voos em nenhuma data
        _log('error', resultado_busca['mensagem'])
        return []

    def _log_rate_limit(self, headers: Dict[str, str], endpoint: str, status_code: Optional[int] = None) -> None:
        if not headers:
            return

        limit = headers.get('X-RateLimit-Limit')
        remaining = headers.get('X-RateLimit-Remaining')
        period = headers.get('X-RateLimit-Period')
        reset = headers.get('X-RateLimit-Reset')

        if all(value is None for value in (limit, remaining, period, reset)):
            return

        def to_int(value: Optional[str]) -> Optional[int]:
            try:
                return int(value) if value is not None else None
            except (TypeError, ValueError):
                return None

        limit_value = to_int(limit)
        remaining_value = to_int(remaining)
        period_value = to_int(period)
        reset_epoch_value = to_int(reset)
        reset_at_value = None

        if reset_epoch_value:
            try:
                reset_at_value = datetime.utcfromtimestamp(reset_epoch_value)
            except (OverflowError, OSError, ValueError):
                reset_at_value = None

        alert_triggered = bool(
            remaining_value is not None and self.rate_limit_alert_threshold is not None and remaining_value <= self.rate_limit_alert_threshold
        )

        log_entry = AmadeusRateLimitLog(
            endpoint=endpoint,
            status_code=status_code,
            limit=limit_value,
            remaining=remaining_value,
            period=period_value,
            reset_epoch=reset_epoch_value,
            reset_at=reset_at_value,
            alert_triggered=alert_triggered,
            raw_headers=json.dumps({k: v for k, v in headers.items()})
        )

        try:
            db.session.add(log_entry)
            db.session.commit()
        except Exception as db_error:
            db.session.rollback()
            print(f"Erro ao registrar limites Amadeus: {db_error}")

        if alert_triggered:
            message = f"Atenção: limite Amadeus próximo do esgotamento. Restantes: {remaining_value}"
            if current_app:
                current_app.logger.warning(message)
            else:
                print(message)
