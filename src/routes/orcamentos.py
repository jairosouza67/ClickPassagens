from flask import Blueprint, request, jsonify, send_file
from datetime import datetime, timedelta
import json
import io
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from src.models.milhas import db, Orcamento, Usuario, BuscaPassagem, ResultadoBusca

orcamentos_bp = Blueprint('orcamentos', __name__)

@orcamentos_bp.route('/criar', methods=['POST'])
def criar_orcamento():
    """Cria um novo orçamento personalizado"""
    try:
        data = request.get_json()
        
        # Validação dos dados obrigatórios
        required_fields = ['usuario_id', 'titulo', 'busca_id', 'resultados_selecionados']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Campo obrigatório: {field}'
                }), 400
        
        # Verificar se usuário existe
        usuario = Usuario.query.get_or_404(data['usuario_id'])
        
        # Verificar se busca existe
        busca = BuscaPassagem.query.get_or_404(data['busca_id'])
        
        # Criar orçamento
        orcamento = Orcamento(
            usuario_id=data['usuario_id'],
            titulo=data['titulo'],
            subtitulo=data.get('subtitulo', ''),
            observacoes=data.get('observacoes', ''),
            logo_url=data.get('logo_url', ''),
            cor_primaria=data.get('cor_primaria', '#3B82F6'),
            cor_secundaria=data.get('cor_secundaria', '#1E40AF'),
            dados_busca=json.dumps(busca.to_dict()),
            resultados_selecionados=json.dumps(data['resultados_selecionados']),
            data_validade=datetime.utcnow() + timedelta(days=30)  # Válido por 30 dias
        )
        
        db.session.add(orcamento)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': orcamento.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orcamentos_bp.route('/listar/<int:usuario_id>', methods=['GET'])
def listar_orcamentos(usuario_id):
    """Lista orçamentos do usuário"""
    try:
        orcamentos = Orcamento.query.filter_by(usuario_id=usuario_id).order_by(Orcamento.data_criacao.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [orcamento.to_dict() for orcamento in orcamentos]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orcamentos_bp.route('/obter/<int:orcamento_id>', methods=['GET'])
def obter_orcamento(orcamento_id):
    """Obtém detalhes de um orçamento específico"""
    try:
        orcamento = Orcamento.query.get_or_404(orcamento_id)
        
        # Deserializar dados
        dados_busca = json.loads(orcamento.dados_busca)
        resultados_selecionados = json.loads(orcamento.resultados_selecionados)
        
        # Obter detalhes dos resultados
        resultado_ids = [r['id'] for r in resultados_selecionados]
        resultados_detalhados = ResultadoBusca.query.filter(ResultadoBusca.id.in_(resultado_ids)).all()
        
        response_data = orcamento.to_dict()
        response_data.update({
            'dados_busca': dados_busca,
            'resultados_detalhados': [resultado.to_dict() for resultado in resultados_detalhados]
        })
        
        return jsonify({
            'success': True,
            'data': response_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orcamentos_bp.route('/atualizar/<int:orcamento_id>', methods=['PUT'])
def atualizar_orcamento(orcamento_id):
    """Atualiza um orçamento existente"""
    try:
        orcamento = Orcamento.query.get_or_404(orcamento_id)
        data = request.get_json()
        
        # Atualizar campos permitidos
        campos_permitidos = ['titulo', 'subtitulo', 'observacoes', 'logo_url', 'cor_primaria', 'cor_secundaria']
        for campo in campos_permitidos:
            if campo in data:
                setattr(orcamento, campo, data[campo])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': orcamento.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orcamentos_bp.route('/excluir/<int:orcamento_id>', methods=['DELETE'])
def excluir_orcamento(orcamento_id):
    """Exclui um orçamento"""
    try:
        orcamento = Orcamento.query.get_or_404(orcamento_id)
        
        db.session.delete(orcamento)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Orçamento excluído com sucesso'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orcamentos_bp.route('/gerar-pdf/<int:orcamento_id>', methods=['GET'])
def gerar_pdf_orcamento(orcamento_id):
    """Gera PDF do orçamento"""
    try:
        orcamento = Orcamento.query.get_or_404(orcamento_id)
        
        # Deserializar dados
        dados_busca = json.loads(orcamento.dados_busca)
        resultados_selecionados = json.loads(orcamento.resultados_selecionados)
        
        # Obter detalhes dos resultados
        resultado_ids = [r['id'] for r in resultados_selecionados]
        resultados_detalhados = ResultadoBusca.query.filter(ResultadoBusca.id.in_(resultado_ids)).all()
        
        # Criar PDF em memória
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        
        # Estilos
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.HexColor(orcamento.cor_primaria)
        )
        
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Heading2'],
            fontSize=16,
            spaceAfter=20,
            textColor=colors.HexColor(orcamento.cor_secundaria)
        )
        
        # Conteúdo do PDF
        story = []
        
        # Título
        story.append(Paragraph(orcamento.titulo, title_style))
        
        if orcamento.subtitulo:
            story.append(Paragraph(orcamento.subtitulo, subtitle_style))
        
        story.append(Spacer(1, 20))
        
        # Informações da busca
        story.append(Paragraph("Detalhes da Viagem", styles['Heading2']))
        
        busca_info = [
            ['Origem:', dados_busca['origem']],
            ['Destino:', dados_busca['destino']],
            ['Data de Ida:', dados_busca['data_ida']],
            ['Passageiros:', str(dados_busca['passageiros'])],
            ['Classe:', dados_busca['classe'].title()]
        ]
        
        if dados_busca.get('data_volta'):
            busca_info.insert(3, ['Data de Volta:', dados_busca['data_volta']])
        
        busca_table = Table(busca_info, colWidths=[2*inch, 3*inch])
        busca_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        story.append(busca_table)
        story.append(Spacer(1, 20))
        
        # Resultados selecionados
        story.append(Paragraph("Opções de Voo", styles['Heading2']))
        
        # Cabeçalho da tabela
        dados_tabela = [['Companhia', 'Horário', 'Milhas', 'Preço em R$', 'Economia']]
        
        for resultado in resultados_detalhados:
            dados_tabela.append([
                resultado.companhia.nome,
                f"{resultado.horario_saida.strftime('%H:%M')} - {resultado.horario_chegada.strftime('%H:%M')}",
                f"{resultado.milhas_necessarias:,} milhas",
                f"R$ {resultado.preco_dinheiro:.2f}",
                f"R$ {resultado.economia_calculada:.2f}"
            ])
        
        resultados_table = Table(dados_tabela, colWidths=[1.2*inch, 1.5*inch, 1.2*inch, 1.2*inch, 1.2*inch])
        resultados_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor(orcamento.cor_primaria)),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(resultados_table)
        story.append(Spacer(1, 20))
        
        # Observações
        if orcamento.observacoes:
            story.append(Paragraph("Observações", styles['Heading2']))
            story.append(Paragraph(orcamento.observacoes, styles['Normal']))
            story.append(Spacer(1, 20))
        
        # Rodapé
        story.append(Spacer(1, 30))
        story.append(Paragraph("Orçamento gerado em: " + datetime.now().strftime('%d/%m/%Y às %H:%M'), styles['Normal']))
        story.append(Paragraph("Válido até: " + orcamento.data_validade.strftime('%d/%m/%Y'), styles['Normal']))
        story.append(Paragraph("ClickPassagens - Encontre as melhores passagens com milhas", styles['Normal']))
        
        # Construir PDF
        doc.build(story)
        
        # Retornar arquivo
        buffer.seek(0)
        
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"orcamento_{orcamento_id}.pdf",
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@orcamentos_bp.route('/templates', methods=['GET'])
def listar_templates():
    """Lista templates de orçamento disponíveis"""
    try:
        templates = [
            {
                'id': 1,
                'nome': 'Clássico',
                'descricao': 'Template limpo e profissional',
                'cor_primaria': '#3B82F6',
                'cor_secundaria': '#1E40AF'
            },
            {
                'id': 2,
                'nome': 'Moderno',
                'descricao': 'Design moderno com gradientes',
                'cor_primaria': '#10B981',
                'cor_secundaria': '#059669'
            },
            {
                'id': 3,
                'nome': 'Elegante',
                'descricao': 'Estilo elegante e sofisticado',
                'cor_primaria': '#8B5CF6',
                'cor_secundaria': '#7C3AED'
            },
            {
                'id': 4,
                'nome': 'Corporativo',
                'descricao': 'Ideal para empresas',
                'cor_primaria': '#374151',
                'cor_secundaria': '#1F2937'
            }
        ]
        
        return jsonify({
            'success': True,
            'data': templates
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
