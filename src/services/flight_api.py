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
        self.amadeus_api_key = config('AMADEUS_API_KEY', default='')
        self.amadeus_api_secret = config('AMADEUS_API_SECRET', default='')
        self.skyscanner_api_key = config('SKYSCANNER_API_KEY', default='')
        self.amadeus_base_url = config('AMADEUS_BASE_URL', default='https://test.api.amadeus.com')
        self.amadeus_token = None
        self.amadeus_token_expiration = None
        self.mode = config('FLIGHT_API_MODE', default='development').lower()
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
        """Busca voos usando a API Amadeus"""
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
            'max': 20  # Máximo de resultados
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
        """Converte resposta da Amadeus para formato interno"""
        resultados = []
        
        if 'data' not in data:
            return resultados
        
        for offer in data['data']:
            try:
                itinerary = offer['itineraries'][0]  # Primeira parte da viagem
                segment = itinerary['segments'][0]   # Primeiro segmento
                
                # Informações da companhia
                carrier_code = segment['carrierCode']
                companhia_nome = self.get_airline_name(carrier_code)
                
                # Horários
                departure = segment['departure']
                arrival = segment['arrival']
                
                # Preço
                price_info = offer['price']
                preco = float(price_info['total'])
                
                # Calcular milhas estimadas (1 real = ~50 milhas, aproximadamente)
                milhas_estimadas = int(preco * 50)
                economia_calculada = preco * 0.25  # 25% de economia média
                
                resultado = {
                    'companhia': {
                        'id': None,
                        'nome': companhia_nome,
                        'codigo': carrier_code,
                        'logo_url': f"https://images.kiwi.com/airlines/64/{carrier_code}.png",
                        'ativa': True,
                        'valor_milheiro': 20.0,
                        'comissao_percentual': 3.0
                    },
                    'voo_numero': segment['number'],
                    'horario_saida': departure['at'].split('T')[1][:5],
                    'horario_chegada': arrival['at'].split('T')[1][:5],
                    'milhas_necessarias': milhas_estimadas,
                    'preco_dinheiro': preco,
                    'economia_calculada': economia_calculada,
                    'paradas': 'Direto' if len(itinerary['segments']) == 1 else f"{len(itinerary['segments']) - 1} parada(s)",
                    'disponivel': True,
                    'origem': departure['iataCode'],
                    'destino': arrival['iataCode'],
                    'duracao': itinerary['duration']
                }
                
                resultados.append(resultado)
                
            except Exception as e:
                print(f"Erro ao processar oferta: {e}")
                continue
        
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
    
    def search_flights_fallback(self, origem: str, destino: str, data_ida: str, 
                               data_volta: str = None, passageiros: int = 1) -> List[Dict]:
        """Dados de fallback quando APIs externas não estão disponíveis"""
        # Lista de companhias reais brasileiras e internacionais
        companhias_reais = [
            {'codigo': 'G3', 'nome': 'Gol', 'valor_milheiro': 18.0},
            {'codigo': 'AD', 'nome': 'Azul', 'valor_milheiro': 20.0},
            {'codigo': 'LA', 'nome': 'LATAM', 'valor_milheiro': 22.0},
            {'codigo': 'AV', 'nome': 'Avianca', 'valor_milheiro': 19.0},
            {'codigo': 'TP', 'nome': 'TAP', 'valor_milheiro': 25.0},
            {'codigo': 'AF', 'nome': 'Air France', 'valor_milheiro': 28.0},
            {'codigo': 'KL', 'nome': 'KLM', 'valor_milheiro': 26.0},
            {'codigo': 'IB', 'nome': 'Ibéria', 'valor_milheiro': 24.0}
        ]
        
        resultados = []
        
        # Gerar dados mais realistas baseados na rota
        base_price = self.calculate_base_price(origem, destino)
        
        for companhia in companhias_reais[:6]:  # Limitar a 6 companhias
            # Gerar 1-2 voos por companhia
            num_voos = 1 if len(resultados) > 8 else 2
            
            for i in range(num_voos):
                # Preços mais realistas
                variacao = 1 + (i * 0.15)  # 15% de variação por voo
                preco = base_price * variacao * (companhia['valor_milheiro'] / 20)
                
                # Milhas baseadas no preço real
                milhas = int(preco * 45)  # ~45 milhas por real
                economia = preco * 0.2   # 20% de economia
                
                # Horários mais realistas
                hora_base = 6 + (i * 4) + (len(resultados) % 3)
                duracao_voo = self.calculate_flight_duration(origem, destino)
                
                resultado = {
                    'companhia': {
                        'id': None,
                        'nome': companhia['nome'],
                        'codigo': companhia['codigo'],
                        'logo_url': f"https://images.kiwi.com/airlines/64/{companhia['codigo']}.png",
                        'ativa': True,
                        'valor_milheiro': companhia['valor_milheiro'],
                        'comissao_percentual': 3.0
                    },
                    'voo_numero': f"{companhia['codigo']}{1000 + len(resultados) * 100 + i}",
                    'horario_saida': f"{hora_base:02d}:{(i * 15) % 60:02d}",
                    'horario_chegada': f"{(hora_base + duracao_voo) % 24:02d}:{((i * 15) + 30) % 60:02d}",
                    'milhas_necessarias': milhas,
                    'preco_dinheiro': round(preco, 2),
                    'economia_calculada': round(economia, 2),
                    'paradas': 'Direto' if i == 0 else '1 parada',
                    'disponivel': True,
                    'origem': origem,
                    'destino': destino,
                    'duracao': f"PT{duracao_voo}H{30 if i == 1 else 0}M"
                }
                
                resultados.append(resultado)
        
        return resultados
    
    def calculate_base_price(self, origem: str, destino: str) -> float:
        """Calcula preço base baseado na rota"""
        # Preços base por tipo de rota (valores mais realistas para 2025)
        rotas_domesticas = ['GRU', 'GIG', 'BSB', 'CGH', 'SDU', 'SSA', 'FOR', 'REC', 'POA', 'CWB']
        
        if origem in rotas_domesticas and destino in rotas_domesticas:
            return 350.0  # Voos domésticos
        else:
            return 1200.0  # Voos internacionais
    
    def calculate_flight_duration(self, origem: str, destino: str) -> int:
        """Calcula duração estimada do voo em horas"""
        rotas_domesticas = ['GRU', 'GIG', 'BSB', 'CGH', 'SDU', 'SSA', 'FOR', 'REC', 'POA', 'CWB']
        
        if origem in rotas_domesticas and destino in rotas_domesticas:
            return 2  # Voos domésticos: ~2 horas
        else:
            return 8  # Voos internacionais: ~8 horas
    
    def search_flights(self, origem: str, destino: str, data_ida: str, 
                      data_volta: str = None, passageiros: int = 1) -> List[Dict]:
        """Método principal para busca de voos"""
        _log('info', f"Buscando voos reais: {origem} -> {destino} em {data_ida}")
        _log('info', f"Modo: {self.mode}, Allow Fallback: {self.allow_fallback}")

        providers_errors: List[str] = []

        if self.amadeus_api_key and self.amadeus_api_secret:
            _log('info', "Credenciais Amadeus configuradas, tentando busca...")
            resultados = self.search_flights_amadeus(origem, destino, data_ida, data_volta, passageiros)
            if resultados:
                _log('info', f"Encontrados {len(resultados)} voos via Amadeus")
                return resultados
            providers_errors.append('Amadeus não retornou resultados válidos para a busca solicitada.')
            _log('warning', f"Amadeus não retornou resultados")
        else:
            providers_errors.append('Credenciais da API Amadeus não configuradas.')
            _log('error', "Credenciais Amadeus NÃO configuradas!")

        if not self.allow_fallback:
            detalhes = ' '.join(providers_errors) if providers_errors else 'Nenhum provedor real disponível.'
            error_msg = f"Não foi possível obter voos reais. {detalhes} Configure as credenciais corretas ou ajuste FLIGHT_API_ALLOW_FALLBACK."
            _log('error', error_msg)
            raise RuntimeError(error_msg)

        _log('warning', "Usando dados de fallback realistas")
        if providers_errors:
            _log('warning', "Motivo do fallback: " + ' | '.join(providers_errors))
        return self.search_flights_fallback(origem, destino, data_ida, data_volta, passageiros)

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
