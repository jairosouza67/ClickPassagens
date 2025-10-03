from flask import Blueprint, request, jsonify
from datetime import datetime, time
import json
import random
from src.models.milhas import db, BuscaPassagem, ResultadoBusca, CompanhiaAerea, Usuario, StatusBusca, AmadeusRateLimitLog
from src.services.flight_api import FlightAPIService

busca_bp = Blueprint('busca', __name__)

@busca_bp.route('/companhias', methods=['GET'])
def listar_companhias():
    """Lista todas as companhias aéreas ativas"""
    try:
        companhias = CompanhiaAerea.query.filter_by(ativa=True).all()
        return jsonify({
            'success': True,
            'data': [companhia.to_dict() for companhia in companhias]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@busca_bp.route('/limite/amadeus', methods=['GET'])
def obter_limite_amadeus():
    """Retorna o status do limite de requisições da API Amadeus"""
    try:
        limite_atual = AmadeusRateLimitLog.query.order_by(AmadeusRateLimitLog.created_at.desc()).first()
        historico = AmadeusRateLimitLog.query.order_by(AmadeusRateLimitLog.created_at.desc()).limit(20).all()

        return jsonify({
            'success': True,
            'data': {
                'atual': limite_atual.to_dict() if limite_atual else None,
                'historico': [registro.to_dict() for registro in historico]
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@busca_bp.route('/buscar', methods=['POST'])
def buscar_passagens():
    """Realiza busca de passagens"""
    try:
        data = request.get_json()
        
        # Validação dos dados obrigatórios
        required_fields = ['origem', 'destino', 'data_ida']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Campo obrigatório: {field}'
                }), 400
        
        # Criar registro da busca
        busca = BuscaPassagem(
            usuario_id=data.get('usuario_id', 1),  # Por enquanto usuário padrão
            origem=data['origem'],
            destino=data['destino'],
            data_ida=datetime.strptime(data['data_ida'], '%Y-%m-%d').date(),
            data_volta=datetime.strptime(data['data_volta'], '%Y-%m-%d').date() if data.get('data_volta') else None,
            passageiros=data.get('passageiros', 1),
            classe=data.get('classe', 'economica'),
            companhias_selecionadas=json.dumps(data.get('companhias', []))
        )
        
        db.session.add(busca)
        db.session.commit()
        
        # Buscar voos reais usando o serviço de API
        flight_service = FlightAPIService()
        resultados = flight_service.search_flights(
            origem=data['origem'],
            destino=data['destino'], 
            data_ida=data['data_ida'],
            data_volta=data.get('data_volta'),
            passageiros=data.get('passageiros', 1)
        )
        
        # Salvar resultados no banco (opcional, para histórico)
        salvar_resultados_banco(busca.id, resultados)
        
        # Atualizar status da busca
        busca.status = StatusBusca.CONCLUIDA
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'busca_id': busca.id,
                'resultados': resultados
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def salvar_resultados_banco(busca_id, resultados):
    """Salva resultados da API no banco de dados"""
    for resultado in resultados:
        try:
            # Criar ou encontrar companhia
            companhia_data = resultado['companhia']
            companhia = CompanhiaAerea.query.filter_by(codigo=companhia_data['codigo']).first()
            
            if not companhia:
                companhia = CompanhiaAerea(
                    nome=companhia_data['nome'],
                    codigo=companhia_data['codigo'],
                    logo_url=companhia_data.get('logo_url', ''),
                    ativa=True,
                    valor_milheiro=companhia_data.get('valor_milheiro', 20.0)
                )
                db.session.add(companhia)
                db.session.flush()  # Para obter o ID
            
            # Converter strings de horário para objetos time
            try:
                hora_saida = datetime.strptime(resultado['horario_saida'], '%H:%M').time()
                hora_chegada = datetime.strptime(resultado['horario_chegada'], '%H:%M').time()
            except:
                hora_saida = time(8, 0)  # Fallback
                hora_chegada = time(10, 0)
            
            # Criar resultado no banco
            resultado_db = ResultadoBusca(
                busca_id=busca_id,
                companhia_id=companhia.id,
                voo_numero=resultado['voo_numero'],
                horario_saida=hora_saida,
                horario_chegada=hora_chegada,
                milhas_necessarias=resultado['milhas_necessarias'],
                preco_dinheiro=resultado['preco_dinheiro'],
                economia_calculada=resultado['economia_calculada'],
                paradas=resultado['paradas'],
                disponivel=resultado.get('disponivel', True)
            )
            
            db.session.add(resultado_db)
            
        except Exception as e:
            print(f"Erro ao salvar resultado: {e}")
            continue
    
    try:
        db.session.commit()
    except Exception as e:
        print(f"Erro ao commitar resultados: {e}")
        db.session.rollback()

@busca_bp.route('/historico/<int:usuario_id>', methods=['GET'])
def historico_buscas(usuario_id):
    """Retorna histórico de buscas do usuário"""
    try:
        buscas = BuscaPassagem.query.filter_by(usuario_id=usuario_id).order_by(BuscaPassagem.data_busca.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [busca.to_dict() for busca in buscas]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@busca_bp.route('/resultado/<int:busca_id>', methods=['GET'])
def obter_resultados_busca(busca_id):
    """Retorna resultados de uma busca específica"""
    try:
        busca = BuscaPassagem.query.get_or_404(busca_id)
        resultados = ResultadoBusca.query.filter_by(busca_id=busca_id).all()
        
        return jsonify({
            'success': True,
            'data': {
                'busca': busca.to_dict(),
                'resultados': [resultado.to_dict() for resultado in resultados]
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@busca_bp.route('/filtrar', methods=['POST'])
def filtrar_resultados():
    """Aplica filtros aos resultados de busca"""
    try:
        data = request.get_json()
        busca_id = data.get('busca_id')
        filtros = data.get('filtros', {})
        
        query = ResultadoBusca.query.filter_by(busca_id=busca_id)
        
        # Aplicar filtros
        if 'companhias' in filtros and filtros['companhias']:
            query = query.join(CompanhiaAerea).filter(CompanhiaAerea.codigo.in_(filtros['companhias']))
        
        if 'milhas_max' in filtros:
            query = query.filter(ResultadoBusca.milhas_necessarias <= filtros['milhas_max'])
        
        if 'paradas' in filtros:
            if filtros['paradas'] == 'direto':
                query = query.filter(ResultadoBusca.paradas == 'Direto')
            elif filtros['paradas'] == 'com_paradas':
                query = query.filter(ResultadoBusca.paradas != 'Direto')
        
        if 'horario' in filtros:
            horario = filtros['horario']
            if horario == 'manha':
                query = query.filter(ResultadoBusca.horario_saida.between(time(6, 0), time(11, 59)))
            elif horario == 'tarde':
                query = query.filter(ResultadoBusca.horario_saida.between(time(12, 0), time(17, 59)))
            elif horario == 'noite':
                query = query.filter(ResultadoBusca.horario_saida.between(time(18, 0), time(23, 59)))
        
        resultados = query.all()
        
        return jsonify({
            'success': True,
            'data': [resultado.to_dict() for resultado in resultados]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
