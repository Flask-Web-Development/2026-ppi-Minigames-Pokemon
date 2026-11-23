# Minigames-Pokemon

Projeto desenvolvido para a disciplina de **Programação para Internet**, ministrada pelo professor Daniel Aguiar, na turma INFO3V.

O grupo é constituído por:

- Alanderson Lima
- Alexandre do Nascimento
- Douglas Mesquita
- Gabriel Nascimento

## Sobre o projeto

O projeto tem como objetivo colocar em prática as habilidades e os conhecimentos adquiridos ao longo da disciplina de Programação para Internet, integrando conceitos de Física.

Nossa proposta é desenvolver um site com minigames educativos inspirados no universo Pokémon, utilizando mecânicas interativas para apresentar e explorar conteúdos de Física de maneira mais dinâmica e interessante.

## Tecnologias utilizadas

### Frontend

- **React:** biblioteca JavaScript utilizada para construção das interfaces e gerenciamento dos componentes.
- **JavaScript:** linguagem utilizada para implementar as funcionalidades e a lógica dos minigames.
- **Vite:** ferramenta responsável pelo ambiente de desenvolvimento e inicialização do frontend.
- **Tailwind CSS:** framework utilizado para estilização das interfaces.
- **SVG:** utilizado para criação de elementos gráficos, como trajetórias e pistas das simulações.

### Backend

- **Python:** linguagem utilizada no desenvolvimento do servidor.
- **Flask:** framework responsável pela criação da aplicação backend e das rotas da API.
- **Flask-SQLAlchemy:** integração entre Flask e SQLAlchemy para gerenciamento do banco de dados.
- **SQLite:** sistema de gerenciamento de banco de dados utilizado para armazenamento das informações.
- **Flask-JWT-Extended:** biblioteca utilizada para autenticação baseada em tokens JWT.
- **Flask-CORS:** responsável pelo controle de acesso entre frontend e backend.
- **Werkzeug Security:** utilizado para geração e verificação de hashes de senhas.
- **Email Validator:** biblioteca utilizada para validação de endereços de e-mail.

## Minigames

### ObliCatch

Minigame baseado no conceito de lançamento oblíquo. O jogador controla parâmetros como ângulo de lançamento, velocidade inicial e gravidade para arremessar uma Pokébola e tentar atingir um Pokémon.

A simulação permite observar a trajetória parabólica e explorar a influência dos parâmetros físicos no movimento.

### PotenVolt

Minigame baseado nos conceitos de energia cinética e energia potencial gravitacional. O jogador interage com um Pokémon esférico em diferentes pistas, podendo observar seu movimento e a transformação das energias envolvidas.

A proposta também contempla a análise da influência da gravidade, massa e resistência ao rolamento.

## Funcionalidades do sistema

- Cadastro de usuários.
- Login e autenticação utilizando tokens JWT.
- Consulta dos dados do usuário autenticado.
- Integração entre frontend e backend por meio de uma API.
- Minigames interativos com conceitos de Física.
- Interface desenvolvida com componentes reutilizáveis.

## Arquitetura do projeto

O projeto está dividido em duas aplicações independentes:

**Frontend:** responsável pela interface com o usuário, interação com os minigames e comunicação com o backend.

**Backend:** responsável pelo processamento das requisições, autenticação, gerenciamento dos dados e comunicação com o banco de dados.

A comunicação entre as aplicações ocorre por meio de requisições HTTP, com troca de informações no formato JSON.

## Estrutura do projeto

```text
Minigames-Pokemon/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── extensions.py
│   │   └── __init__.py
│   │
│   ├── instance/
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── games/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Como rodar o projeto

### Pré-requisitos

Antes de executar o projeto, é necessário possuir:

- Python instalado.
- Node.js e npm instalados.

### 1. Executando o backend

A partir da pasta raiz do projeto, acesse o diretório do backend:

```powershell
cd backend
```

Crie um ambiente virtual para isolar as dependências do projeto:

```powershell
python -m venv venv
```

Ative o ambiente virtual:

```powershell
.\venv\Scripts\Activate.ps1
```

Instale as dependências:

```powershell
pip install -r requirements.txt
```

Inicie o servidor backend:

```powershell
python run.py
```

Mantenha esse terminal aberto enquanto estiver utilizando a aplicação.

### 2. Executando o frontend

Abra um novo terminal, a partir da pasta raiz do projeto, e acesse o diretório do frontend:

```powershell
cd frontend
```

Instale as dependências:

```powershell
npm install
```

Inicie o servidor de desenvolvimento:

```powershell
npm run dev
```

O Vite exibirá o endereço para acessar a aplicação. Normalmente:

```text
http://localhost:5173
```

Caso outra porta seja utilizada, acesse o endereço apresentado no terminal.
