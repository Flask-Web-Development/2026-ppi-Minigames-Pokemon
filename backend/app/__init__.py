from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

from app.models import usuario

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pokenewton.db'
    db.init_app(app)

    @app.route('/', methods=['GET'])
    def home():
        return jsonify({"mensagem": "Backend do Minigame Pokémon está funcionando!", "status": "online"})

    from app.models import usuario, Minigame, Postagem, Resposta

    return app

