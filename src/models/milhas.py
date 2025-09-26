from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum

db = SQLAlchemy()

class TipoUsuario(Enum):
    GRATUITO = "gratuito"
    BASICO = "basico"
    PREMIUM = "premium"
    AGENTE = "agente"
    EMPRESA = "empresa"

class StatusBusca(Enum):
    PENDENTE = "pendente"
    PROCESSANDO = "processando"
    CONCLUIDA = "concluida"
    ERRO = "erro"

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(255), nullable=False)
    tipo_usuario = db.Column(db.Enum(TipoUsuario), default=TipoUsuario.GRATUITO)
    consultas_utilizadas = db.Column(db.Integer, default=0)
    consultas_limite = db.Column(db.Integer, default=5)
    saldo_cashback = db.Column(db.Float, default=0.0)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_ultima_renovacao = db.Column(db.DateTime, default=datetime.utcnow)
    ativo = db.Column(db.Boolean, default=True)
    
    # Relacionamentos
    buscas = db.relationship('BuscaPassagem', backref='usuario', lazy=True)
    orcamentos = db.relationship('Orcamento', backref='usuario', lazy=True)
    indicacoes = db.relationship('Indicacao', foreign_keys='Indicacao.usuario_indicador_id', backref='indicador', lazy=True)
    
    def __repr__(self):
        return f'<Usuario {self.email}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'tipo_usuario': self.tipo_usuario.value,
            'consultas_utilizadas': self.consultas_utilizadas,
            'consultas_limite': self.consultas_limite,
            'saldo_cashback': self.saldo_cashback,
            'data_criacao': self.data_criacao.isoformat(),
            'ativo': self.ativo
        }

class CompanhiaAerea(db.Model):
    __tablename__ = 'companhias_aereas'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50), nullable=False)
    codigo = db.Column(db.String(10), unique=True, nullable=False)
    logo_url = db.Column(db.String(255))
    ativa = db.Column(db.Boolean, default=True)
    valor_milheiro = db.Column(db.Float, default=20.0)
    comissao_percentual = db.Column(db.Float, default=3.0)
    
    def __repr__(self):
        return f'<CompanhiaAerea {self.nome}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'codigo': self.codigo,
            'logo_url': self.logo_url,
            'ativa': self.ativa,
            'valor_milheiro': self.valor_milheiro,
            'comissao_percentual': self.comissao_percentual
        }

class BuscaPassagem(db.Model):
    __tablename__ = 'buscas_passagens'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    origem = db.Column(db.String(10), nullable=False)
    destino = db.Column(db.String(10), nullable=False)
    data_ida = db.Column(db.Date, nullable=False)
    data_volta = db.Column(db.Date)
    passageiros = db.Column(db.Integer, default=1)
    classe = db.Column(db.String(20), default='economica')
    status = db.Column(db.Enum(StatusBusca), default=StatusBusca.PENDENTE)
    data_busca = db.Column(db.DateTime, default=datetime.utcnow)
    companhias_selecionadas = db.Column(db.Text)  # JSON string
    
    # Relacionamentos
    resultados = db.relationship('ResultadoBusca', backref='busca', lazy=True)
    
    def __repr__(self):
        return f'<BuscaPassagem {self.origem}-{self.destino}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'origem': self.origem,
            'destino': self.destino,
            'data_ida': self.data_ida.isoformat(),
            'data_volta': self.data_volta.isoformat() if self.data_volta else None,
            'passageiros': self.passageiros,
            'classe': self.classe,
            'status': self.status.value,
            'data_busca': self.data_busca.isoformat()
        }

class ResultadoBusca(db.Model):
    __tablename__ = 'resultados_busca'
    
    id = db.Column(db.Integer, primary_key=True)
    busca_id = db.Column(db.Integer, db.ForeignKey('buscas_passagens.id'), nullable=False)
    companhia_id = db.Column(db.Integer, db.ForeignKey('companhias_aereas.id'), nullable=False)
    voo_numero = db.Column(db.String(20))
    horario_saida = db.Column(db.Time)
    horario_chegada = db.Column(db.Time)
    milhas_necessarias = db.Column(db.Integer)
    preco_dinheiro = db.Column(db.Float)
    economia_calculada = db.Column(db.Float)
    paradas = db.Column(db.String(100))
    disponivel = db.Column(db.Boolean, default=True)
    
    # Relacionamentos
    companhia = db.relationship('CompanhiaAerea', backref='resultados')
    
    def __repr__(self):
        return f'<ResultadoBusca {self.voo_numero}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'companhia': self.companhia.to_dict() if self.companhia else None,
            'voo_numero': self.voo_numero,
            'horario_saida': self.horario_saida.strftime('%H:%M') if self.horario_saida else None,
            'horario_chegada': self.horario_chegada.strftime('%H:%M') if self.horario_chegada else None,
            'milhas_necessarias': self.milhas_necessarias,
            'preco_dinheiro': self.preco_dinheiro,
            'economia_calculada': self.economia_calculada,
            'paradas': self.paradas,
            'disponivel': self.disponivel
        }

class Orcamento(db.Model):
    __tablename__ = 'orcamentos'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    subtitulo = db.Column(db.String(200))
    observacoes = db.Column(db.Text)
    logo_url = db.Column(db.String(255))
    cor_primaria = db.Column(db.String(7), default='#3B82F6')
    cor_secundaria = db.Column(db.String(7), default='#1E40AF')
    dados_busca = db.Column(db.Text)  # JSON string
    resultados_selecionados = db.Column(db.Text)  # JSON string
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_validade = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<Orcamento {self.titulo}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'subtitulo': self.subtitulo,
            'observacoes': self.observacoes,
            'logo_url': self.logo_url,
            'cor_primaria': self.cor_primaria,
            'cor_secundaria': self.cor_secundaria,
            'data_criacao': self.data_criacao.isoformat(),
            'data_validade': self.data_validade.isoformat() if self.data_validade else None
        }

class Indicacao(db.Model):
    __tablename__ = 'indicacoes'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_indicador_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    usuario_indicado_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    email_indicado = db.Column(db.String(120), nullable=False)
    codigo_indicacao = db.Column(db.String(50), unique=True, nullable=False)
    comissao_paga = db.Column(db.Float, default=0.0)
    data_indicacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_conversao = db.Column(db.DateTime)
    convertido = db.Column(db.Boolean, default=False)
    
    # Relacionamentos
    usuario_indicado = db.relationship('Usuario', foreign_keys=[usuario_indicado_id], backref='indicado_por')
    
    def __repr__(self):
        return f'<Indicacao {self.codigo_indicacao}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'email_indicado': self.email_indicado,
            'codigo_indicacao': self.codigo_indicacao,
            'comissao_paga': self.comissao_paga,
            'data_indicacao': self.data_indicacao.isoformat(),
            'data_conversao': self.data_conversao.isoformat() if self.data_conversao else None,
            'convertido': self.convertido
        }

class TransacaoCashback(db.Model):
    __tablename__ = 'transacoes_cashback'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    tipo = db.Column(db.String(20), nullable=False)  # 'ganho', 'resgate'
    valor = db.Column(db.Float, nullable=False)
    descricao = db.Column(db.String(200))
    data_transacao = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<TransacaoCashback {self.tipo}: {self.valor}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'tipo': self.tipo,
            'valor': self.valor,
            'descricao': self.descricao,
            'data_transacao': self.data_transacao.isoformat()
        }
