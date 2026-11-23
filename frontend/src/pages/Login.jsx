import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import Header from "../components/header"
import PokeNewton from "../assets/PokeNewton.png"

function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const [mensagem, setMensagem] = useState("")
  const [carregando, setCarregando] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setMensagem("")
    setCarregando(true)

    try {
      const resposta = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          senha
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setMensagem(dados.erro || "E-mail ou senha incorretos.")
        return
      }

      localStorage.setItem("access_token", dados.access_token)
      window.dispatchEvent(new Event("auth-changed"))

      setMensagem("Login realizado com sucesso!")

      setEmail("")
      setSenha("")

      navigate("/")
    } catch (error) {
      setMensagem("Erro ao conectar com o servidor.")
      console.error(error)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0E1631]">
      <Header />
      <main className="mx-auto mt-9 flex w-full max-w-6xl flex-1 items-center justify-center gap-10 p-4 md:justify-between">
        <div className="w-full max-w-md rounded-xl p-8 shadow-md">
          <p className="mb-6 text-center font-pixel text-2xl text-white">
            Bem-vindo de volta!
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-nikukyu">
            <div className="flex flex-col gap-1">
              <label className="text-white">E-mail</label>
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-[40px] border border-slate-500/70 bg-[#141E3E] py-3 pr-12 pl-5 text-white outline-none transition-colors focus:border-[#4779E8]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="pl-2 text-sm text-slate-200">Senha</label>
              <div className="relative flex items-center">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full rounded-[40px] border border-slate-500/70 bg-[#141E3E] py-3 pr-12 pl-5 text-white outline-none transition-colors focus:border-[#4779E8]"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((prev) => !prev)}
                  className="absolute right-4 cursor-pointer text-slate-400 transition-colors hover:text-white"
                  aria-label="Alternar visibilidade da senha"
                >
                  {mostrarSenha ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="mt-2 w-full cursor-pointer rounded-[40px] border border-[#000000] bg-[#050C25] py-3.5 text-center text-white transition-colors hover:border-[#4779E8] hover:bg-[#0B1742] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {mensagem && (
            <p className="mt-4 text-center text-sm text-white">
              {mensagem}
            </p>
          )}

          <p className="mt-5 text-center font-nikukyu text-white">
            Ainda não possui uma conta?{" "}
            <Link to="/register" className="text-blue-600">
              Cadastre-se
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-slate-500">
              Voltar para o início
            </Link>
          </div>
        </div>

        <div className="hidden w-full max-w-[540px] justify-center md:flex">
          <img
            src={PokeNewton}
            alt="PokeNewton"
            className="h-auto w-full rounded-xl object-contain"
          />
        </div>
      </main>
    </div>
  )
}

export default Login