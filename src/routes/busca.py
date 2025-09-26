from flask import Blueprint, request, jsonify
from datetime import datetime, time
import json
import random
from src.models.milhas import db, BuscaPassagem, ResultadoBusca, CompanhiaAerea, Usuario, StatusBusca

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
        
        # Simular busca nas companhias (dados mockados)
        resultados = simular_busca_companhias(busca.id, data)
        
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

def simular_busca_companhias(busca_id, dados_busca):
    """Simula busca nas companhias aéreas com dados mockados"""
    companhias = CompanhiaAerea.query.filter_by(ativa=True).all()
    resultados = []
    
    for companhia in companhias:
        # Simular 1-3 voos por companhia
        num_voos = random.randint(1, 3)
        
        for i in range(num_voos):
            # Gerar dados aleatórios para simulação
            milhas_base = random.randint(8000, 25000)
            preco_dinheiro = milhas_base * companhia.valor_milheiro / 1000
            economia = preco_dinheiro * 0.3  # 30% de economia média
            
            # Horários aleatórios
            hora_saida = time(random.randint(6, 22), random.choice([0, 15, 30, 45]))
            hora_chegada = time(
                (hora_saida.hour + random.randint(1, 4)) % 24,
                random.choice([0, 15, 30, 45])
            )
            
            resultado = ResultadoBusca(
                busca_id=busca_id,
                companhia_id=companhia.id,
                voo_numero=f"{companhia.codigo}{random.randint(1000, 9999)}",
                horario_saida=hora_saida,
                horario_chegada=hora_chegada,
                milhas_necessarias=milhas_base,
                preco_dinheiro=round(preco_dinheiro, 2),
                economia_calculada=round(economia, 2),
                paradas="Direto" if random.choice([True, False]) else "1 parada",
                disponivel=True
            )
            
            db.session.add(resultado)
            resultados.append(resultado)
    
    db.session.commit()
    
    # Retornar resultados serializados
    return [resultado.to_dict() for resultado in resultados]

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
