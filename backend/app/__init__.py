from flask import Flask, jsonify

def create_app():
    app = Flask(__name__)

    @app.route('/', methods=['GET'])
    def home():
        return jsonify({"mensagem": "Backend do Minigame Pokémon está funcionando!", "status": "online"})

    return app

