from flask import Flask, jsonify
from app.extensions import db, jwt
from flask_cors import CORS

import os
import secrets

def obter_chave_jwt():
    chave = os.getenv("JWT_SECRET_KEY")

    if chave:
        return chave

    caminho = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "instance",
        "jwt_secret.key"
    )

    os.makedirs(os.path.dirname(caminho), exist_ok=True)

    if os.path.exists(caminho):
        with open(caminho, "r") as arquivo:
            return arquivo.read().strip()

    chave = secrets.token_hex(32)

    with open(caminho, "w") as arquivo:
        arquivo.write(chave)

    return chave


def create_app():
    app = Flask(__name__)

    CORS(app, origins=["http://localhost:5173"])

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pokenewton.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config['JWT_SECRET_KEY'] = obter_chave_jwt()

    db.init_app(app)
    jwt.init_app(app)

    from app.routes.auth import auth
    app.register_blueprint(auth)

    @app.route('/', methods=['GET'])
    def home():
        return jsonify({
            "mensagem": "Backend do Minigame Pokémon está funcionando!",
            "status": "online"
        })

    from app.models import usuario, Minigame, Postagem, Resposta

    return app