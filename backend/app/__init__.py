
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
        with open(caminho, "r", encoding="utf-8") as arquivo:
            return arquivo.read().strip()

    chave = secrets.token_hex(32)

    with open(caminho, "w", encoding="utf-8") as arquivo:
        arquivo.write(chave)

    return chave


def obter_database_url():
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        return "sqlite:///pokenewton.db"

    if database_url.startswith("postgres://"):
        database_url = database_url.replace(
            "postgres://",
            "postgresql+psycopg://",
            1
        )

    elif database_url.startswith("postgresql://"):
        database_url = database_url.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1
        )

    return database_url


def obter_origens_frontend():
    origens = os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173"
    )

    return [
        origem.strip()
        for origem in origens.split(",")
        if origem.strip()
    ]


def create_app():
    app = Flask(__name__)

    CORS(app, origins=obter_origens_frontend())

    app.config["SQLALCHEMY_DATABASE_URI"] = obter_database_url()
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True
    }

    app.config["JWT_SECRET_KEY"] = obter_chave_jwt()

    db.init_app(app)
    jwt.init_app(app)

    from app.routes.auth import auth
    app.register_blueprint(auth)

    @app.route("/", methods=["GET"])
    def home():
        return jsonify({
            "mensagem": "Backend do Minigame Pokémon está funcionando!",
            "status": "online"
        })

    from app.models import usuario, Minigame, Postagem, Resposta

    return app
