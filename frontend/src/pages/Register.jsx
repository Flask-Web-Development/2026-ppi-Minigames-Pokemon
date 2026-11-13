
import { useState } from "react"
import { Link } from "react-router-dom"

function Cadastro() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [senhaConfirm, setSenhaConfirm] = useState("")

  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMensagem("")

    if (senha !== senhaConfirm) {
      setMensagem("As senhas não coincidem.")
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          senha_confirm: senhaConfirm
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setMensagem(dados.erro || "Não foi possível realizar o cadastro.")
        return
      }

      setMensagem("Cadastro realizado com sucesso!")
      
      setNome("")
      setEmail("")
      setSenha("")
      setSenhaConfirm("")

    } catch (error) {
      setMensagem("Erro ao conectar com o servidor.")
      console.error(error)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Cadastro
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label>Nome</label>
            <input
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="bg-slate-100 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-100 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="bg-slate-100 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Confirmar senha</label>
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={senhaConfirm}
              onChange={(e) => setSenhaConfirm(e.target.value)}
              required
              className="bg-slate-100 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>

        </form>

        {mensagem && (
          <p className="mt-4 text-center text-sm">
            {mensagem}
          </p>
        )}

        <p className="mt-5 text-center">
          Já possui uma conta? <Link to="/login" className="text-blue-600">Faça login</Link>
        </p>

        <div className="mt-4 text-center">
          <Link to="/" className="text-slate-500 text-sm">
            Voltar para o início
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Cadastro
