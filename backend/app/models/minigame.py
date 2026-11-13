from app.extensions import db

class Minigame(db.Model):
    __Tablename__ = 'minigame'

    id_minigame = db.Column(db.Integer, primary_key=True)
    nome_minigame = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text)

