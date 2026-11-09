from app.extensions import db
from datetime import datetime, timezone

class Postagem(db.Model):
    __tablename__ = 'postagem'

    id_postagem = db.Column(db.Integer, primary_key=True)
    conteudo = db.Column(db.Text, nullable=False)
    data = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    respondida = db.Column(db.Boolean, default=False, nullable=False)
    visibilidade = db.Column(db.String(20), nullable=False)

    id_autor = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)
    id_minigame = db.Column(db.Integer, db.ForeignKey('minigame.id_minigame'), nullable=False)

    