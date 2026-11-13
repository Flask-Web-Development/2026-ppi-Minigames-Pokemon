from app.extensions import db
from datetime import datetime, timezone

class Resposta(db.Model):
    __tablename__ = 'resposta'

    id_resposta = db.Column(db.Integer, primary_key=True)
    conteudo = db.Column(db.Text, nullable=False)
    data = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    id_postagem = db.Column(db.Integer, db.ForeignKey('postagem.id_postagem'), nullable=False)
    id_autor = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)

    