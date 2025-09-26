from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import secrets
from src.models.milhas import db, Usuario, TipoUsuario, Indicacao, TransacaoCashback

usuarios_bp = Blueprint('usuarios', __name__)

# Configuração dos planos
PLANOS_CONFIG = {
    TipoUsuario.GRATUITO: {'consultas': 5, 'preco': 0},
    TipoUsuario.BASICO: {'consultas': 100, 'preco': 99},
    TipoUsuario.PREMIUM: {'consultas': 500, 'preco': 299},
    TipoUsuario.AGENTE: {'consultas': 1000, 'preco': 499},
    TipoUsuario.EMPRESA: {'consultas': -1, 'preco': 999}  # -1 = ilimitado
}

@usuarios_bp.route('/cadastro', methods=['POST'])
def cadastrar_usuario():
    """Cadastra um novo usuário"""
    try:
        data = request.get_json()
        
        # Validação dos dados obrigatórios
        required_fields = ['nome', 'email', 'senha']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Campo obrigatório: {field}'
                }), 400
        
        # Verificar se email já existe
        if Usuario.query.filter_by(email=data['email']).first():
            return jsonify({
                'success': False,
                'error': 'Email já cadastrado'
            }), 400
        
        # Criar novo usuário
        usuario = Usuario(
            nome=data['nome'],
            email=data['email'],
            senha_hash=generate_password_hash(data['senha']),
            tipo_usuario=TipoUsuario.GRATUITO,
            consultas_limite=PLANOS_CONFIG[TipoUsuario.GRATUITO]['consultas']
        )
        
        # Verificar código de indicação
        if 'codigo_indicacao' in data and data['codigo_indicacao']:
            indicacao = Indicacao.query.filter_by(codigo_indicacao=data['codigo_indicacao']).first()
            if indicacao and not indicacao.convertido:
                db.session.add(usuario)
                db.session.flush()  # Para obter o ID do usuário
                
                # Atualizar indicação
                indicacao.usuario_indicado_id = usuario.id
                indicacao.data_conversao = datetime.utcnow()
                indicacao.convertido = True
                
                # Adicionar comissão ao indicador (20% do primeiro pagamento)
                # Por enquanto, apenas marcar como convertido
        
        db.session.add(usuario)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': usuario.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@usuarios_bp.route('/login', methods=['POST'])
def login_usuario():
    """Realiza login do usuário"""
    try:
        data = request.get_json()
        
        if 'email' not in data or 'senha' not in data:
            return jsonify({
                'success': False,
                'error': 'Email e senha são obrigatórios'
            }), 400
        
        usuario = Usuario.query.filter_by(email=data['email']).first()
        
        if not usuario or not check_password_hash(usuario.senha_hash, data['senha']):
            return jsonify({
                'success': False,
                'error': 'Credenciais inválidas'
            }), 401
        
        if not usuario.ativo:
            return jsonify({
                'success': False,
                'error': 'Usuário inativo'
            }), 401
        
        return jsonify({
            'success': True,
            'data': usuario.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@usuarios_bp.route('/perfil/<int:usuario_id>', methods=['GET'])
def obter_perfil(usuario_id):
    """Obtém perfil do usuário"""
    try:
        usuario = Usuario.query.get_or_404(usuario_id)
        
        # Calcular estatísticas
        total_buscas = len(usuario.buscas)
        total_orcamentos = len(usuario.orcamentos)
        total_indicacoes = len(usuario.indicacoes)
        
        perfil = usuario.to_dict()
        perfil.update({
            'estatisticas': {
                'total_buscas': total_buscas,
                'total_orcamentos': total_orcamentos,
                'total_indicacoes': total_indicacoes,
                'consultas_restantes': max(0, usuario.consultas_limite - usuario.consultas_utilizadas) if usuario.consultas_limite > 0 else -1
            }
        })
        
        return jsonify({
            'success': True,
            'data': perfil
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@usuarios_bp.route('/planos', methods=['GET'])
def listar_planos():
    """Lista todos os planos disponíveis"""
    try:
        planos = []
        for tipo, config in PLANOS_CONFIG.items():
            planos.append({
                'tipo': tipo.value,
                'nome': tipo.value.title(),
                'consultas': config['consultas'],
                'preco': config['preco'],
                'recursos': obter_recursos_plano(tipo)
            })
        
        return jsonify({
            'success': True,
            'data': planos
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def obter_recursos_plano(tipo_usuario):
    """Retorna recursos disponíveis para cada tipo de plano"""
    recursos_base = ['Busca básica', 'Comparação simples']
    
    if tipo_usuario == TipoUsuario.GRATUITO:
        return recursos_base + ['Suporte por email']
    elif tipo_usuario == TipoUsuario.BASICO:
        return recursos_base + ['Busca avançada', 'Filtros completos', 'Histórico de buscas', 'Suporte prioritário']
    elif tipo_usuario == TipoUsuario.PREMIUM:
        return recursos_base + ['Todas as funcionalidades', 'Orçamentos personalizados', 'Cashback 2%', 'Suporte 24/7']
    elif tipo_usuario == TipoUsuario.AGENTE:
        return recursos_base + ['Painel do agente', 'Comissões configuráveis', 'Marca própria', 'Relatórios avançados']
    elif tipo_usuario == TipoUsuario.EMPRESA:
        return recursos_base + ['Consultas ilimitadas', 'API dedicada', 'Suporte dedicado', 'Relatórios customizados']
    
    return recursos_base

@usuarios_bp.route('/assinar-plano', methods=['POST'])
def assinar_plano():
    """Assina um plano"""
    try:
        data = request.get_json()
        
        usuario_id = data.get('usuario_id')
        tipo_plano = data.get('tipo_plano')
        
        if not usuario_id or not tipo_plano:
            return jsonify({
                'success': False,
                'error': 'Usuario ID e tipo de plano são obrigatórios'
            }), 400
        
        usuario = Usuario.query.get_or_404(usuario_id)
        
        try:
            novo_tipo = TipoUsuario(tipo_plano)
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Tipo de plano inválido'
            }), 400
        
        # Atualizar usuário
        usuario.tipo_usuario = novo_tipo
        usuario.consultas_limite = PLANOS_CONFIG[novo_tipo]['consultas']
        usuario.consultas_utilizadas = 0  # Reset consultas
        usuario.data_ultima_renovacao = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': usuario.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@usuarios_bp.route('/gerar-codigo-indicacao/<int:usuario_id>', methods=['POST'])
def gerar_codigo_indicacao(usuario_id):
    """Gera código de indicação para o usuário"""
    try:
        usuario = Usuario.query.get_or_404(usuario_id)
        
        # Gerar código único
        codigo = f"MILHAS{secrets.token_hex(4).upper()}"
        
        # Verificar se código já existe
        while Indicacao.query.filter_by(codigo_indicacao=codigo).first():
            codigo = f"MILHAS{secrets.token_hex(4).upper()}"
        
        return jsonify({
            'success': True,
            'data': {
                'codigo_indicacao': codigo,
                'link_indicacao': f"https://clickpassagens.com/cadastro?ref={codigo}"
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@usuarios_bp.route('/indicacoes/<int:usuario_id>', methods=['GET'])
def listar_indicacoes(usuario_id):
    """Lista indicações do usuário"""
    try:
        indicacoes = Indicacao.query.filter_by(usuario_indicador_id=usuario_id).all()
        
        return jsonify({
            'success': True,
            'data': [indicacao.to_dict() for indicacao in indicacoes]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@usuarios_bp.route('/cashback/<int:usuario_id>', methods=['GET'])
def obter_cashback(usuario_id):
    """Obtém saldo e histórico de cashback"""
    try:
        usuario = Usuario.query.get_or_404(usuario_id)
        transacoes = TransacaoCashback.query.filter_by(usuario_id=usuario_id).order_by(TransacaoCashback.data_transacao.desc()).all()
        
        return jsonify({
            'success': True,
            'data': {
                'saldo_atual': usuario.saldo_cashback,
                'historico': [transacao.to_dict() for transacao in transacoes]
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@usuarios_bp.route('/resgatar-cashback', methods=['POST'])
def resgatar_cashback():
    """Resgata saldo de cashback"""
    try:
        data = request.get_json()
        
        usuario_id = data.get('usuario_id')
        valor_resgate = data.get('valor')
        
        if not usuario_id or not valor_resgate:
            return jsonify({
                'success': False,
                'error': 'Usuario ID e valor são obrigatórios'
            }), 400
        
        usuario = Usuario.query.get_or_404(usuario_id)
        
        if valor_resgate > usuario.saldo_cashback:
            return jsonify({
                'success': False,
                'error': 'Saldo insuficiente'
            }), 400
        
        if valor_resgate < 50:
            return jsonify({
                'success': False,
                'error': 'Valor mínimo para resgate é R$ 50'
            }), 400
        
        # Processar resgate
        usuario.saldo_cashback -= valor_resgate
        
        # Registrar transação
        transacao = TransacaoCashback(
            usuario_id=usuario_id,
            tipo='resgate',
            valor=-valor_resgate,
            descricao=f'Resgate de cashback - R$ {valor_resgate:.2f}'
        )
        
        db.session.add(transacao)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'novo_saldo': usuario.saldo_cashback,
                'valor_resgatado': valor_resgate
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
