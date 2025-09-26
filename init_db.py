#!/usr/bin/env python3
"""Script para inicializar o banco de dados com dados de exemplo"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask
from src.models.milhas import db, CompanhiaAerea, Usuario, TipoUsuario

def init_database():
    """Inicializa o banco de dados com dados de exemplo"""
    
    # Criar app Flask
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Inicializar db
    db.init_app(app)
    
    with app.app_context():
        # Criar todas as tabelas
        db.create_all()
        print("Tabelas criadas!")
        
        # Verificar se já existem companhias
        if CompanhiaAerea.query.count() == 0:
            # Criar companhias de exemplo
            companhias = [
                CompanhiaAerea(nome='Gol', codigo='G3', valor_milheiro=18.0, ativa=True),
                CompanhiaAerea(nome='Azul', codigo='AD', valor_milheiro=20.0, ativa=True),
                CompanhiaAerea(nome='LATAM', codigo='LA', valor_milheiro=22.0, ativa=True),
                CompanhiaAerea(nome='Avianca', codigo='AV', valor_milheiro=19.0, ativa=True),
                CompanhiaAerea(nome='Ibéria', codigo='IB', valor_milheiro=25.0, ativa=True)
            ]
            
            for companhia in companhias:
                db.session.add(companhia)
            
            db.session.commit()
            print("Companhias criadas com sucesso!")
        else:
            print("Companhias já existem no banco")
        
        # Verificar se existe usuário padrão
        if Usuario.query.count() == 0:
            usuario_padrao = Usuario(
                nome='Usuário Teste',
                email='teste@clickpassagens.com',
                senha_hash='senha_hash_exemplo',
                tipo_usuario=TipoUsuario.PREMIUM
            )
            db.session.add(usuario_padrao)
            db.session.commit()
            print("Usuário padrão criado!")
        else:
            print("Usuários já existem no banco")
    
    print("Inicialização do banco concluída!")

if __name__ == '__main__':
    init_database()