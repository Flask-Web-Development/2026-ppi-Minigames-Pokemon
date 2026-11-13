from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.usuario import Usuario

from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity

from email_validator import validate_email, EmailNotValidError

auth = Blueprint('auth', __name__, url_prefix='/auth')


@auth.route('/register', methods=['POST'])
def register():
    dados = request.get_json()

    if not dados:
        return jsonify({"erro": "Dados não fornecidos"}), 400

    nome = dados.get('nome')
    email = dados.get('email')
    senha = dados.get('senha')
    senha_confirm = dados.get('senha_confirm')

    
    if not nome or not email or not senha or not senha_confirm:
        return jsonify({"erro": "Preencha todos os campos"}), 400

    try:
        email = validate_email(email, check_deliverability=False).normalized
    except EmailNotValidError:
        return jsonify({"erro": "Endereço de e-mail inválido"}), 400

    if Usuario.query.filter_by(email=email).first():
        return jsonify({"erro": "E-mail já cadastrado"}), 409
    
    if senha != senha_confirm:
        return jsonify({"erro": "Senhas não coincidem"}), 400

    usuario = Usuario(
        nome=nome,
        email=email,
        cargo='aluno'
    )

    usuario.definir_senha(senha)

    db.session.add(usuario)
    db.session.commit()

    return jsonify({
        "mensagem": "Conta criada com sucesso",
        "usuario": {
            "id": usuario.id_usuario,
            "nome": usuario.nome,
            "email": usuario.email,
            "cargo": usuario.cargo
        }
    }), 201

@auth.route('/login', methods=['POST'])
def login():
    dados = request.get_json()

    if not dados:
        return jsonify({"erro": "Dados não fornecidos"}), 400

    email = dados.get('email')
    senha = dados.get('senha')

    if not email or not senha:
        return jsonify({"erro": "Informe e-mail e senha"}), 400

    try:
        email = validate_email(email, check_deliverability=False).normalized
    except EmailNotValidError:
        return jsonify({"erro": "E-mail ou senha incorretos"}), 401

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or not usuario.verificar_senha(senha):
        return jsonify({"erro": "E-mail ou senha incorretos"}), 401

    token = create_access_token(
        identity=str(usuario.id_usuario)
    )

    return jsonify({
        "mensagem": "Login realizado com sucesso",
        "access_token": token,
        "usuario": {
            "id": usuario.id_usuario,
            "nome": usuario.nome,
            "email": usuario.email,
            "cargo": usuario.cargo
        }
    }), 200

@auth.route('/me', methods=['GET'])
@jwt_required()
def me():
    id_usuario = get_jwt_identity()

    usuario = db.session.get(Usuario, int(id_usuario))

    if not usuario:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    return jsonify({
        "id": usuario.id_usuario,
        "nome": usuario.nome,
        "email": usuario.email,
        "cargo": usuario.cargo
    }), 200