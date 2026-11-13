
import { useEffect, useState } from "react"
import logo from "../assets/pokeball.png"
import { Link } from "react-router-dom"

function Header() {
    const [usuario, setUsuario] = useState(null)

    useEffect(() => {
        async function carregarUsuario() {
            const token = localStorage.getItem("access_token")

            if (!token) {
                setUsuario(null)
                return
            }

            try {
                const resposta = await fetch("http://localhost:5000/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (!resposta.ok) {
                    if (resposta.status === 401) {
                        localStorage.removeItem("access_token")
                        setUsuario(null)
                    }
                    return
                }

                const dados = await resposta.json()
                setUsuario(dados)

            } catch (error) {
                console.error("Erro ao buscar usuário:", error)
            }
        }

        carregarUsuario()

        window.addEventListener("auth-changed", carregarUsuario)

        return () => {
            window.removeEventListener("auth-changed", carregarUsuario)
        }
    }, [])

    function deslogar() {
        localStorage.removeItem("access_token")
        setUsuario(null)
    }

    return (
        <header className="flex h-auto w-full flex-col items-center justify-between gap-4 bg-[#18244B] px-4 py-4 sm:h-28 sm:flex-row sm:px-8 sm:py-0">

            <Link to="/" className="flex items-center gap-2 sm:gap-4">
                <img src={logo} alt="logo" className="h-10 w-10 object-contain sm:h-16 sm:w-16"/>

                <div className="flex items-baseline text-[#EEFF07] text-xl sm:text-3xl" style={{ fontFamily: "'Luckiest Guy', cursive", WebkitTextStroke: "1px #0800E2" }}>
                    <span>P</span>
                    <span className="text-base sm:text-2xl">o</span>
                    <span>k</span>
                    <span className="text-base sm:text-2xl">é</span>
                    <span>n</span>
                    <span className="text-base sm:text-2xl">e</span>
                    <span className="text-base sm:text-2xl">w</span>
                    <span>t</span>
                    <span className="text-base sm:text-2xl">o</span>
                    <span>n</span>
                </div>
            </Link>

            <div className="flex items-center gap-3 text-xs sm:gap-8 sm:text-lg" style={{ fontFamily: "'Inter', sans-serif"}}>

                <Link to="/" className="text-white hover:text-yellow-400">
                    INÍCIO
                </Link>

                <Link to="/minigames" className="text-white hover:text-yellow-400">
                    MINIJOGOS
                </Link>

                {usuario ? (
                    <div className="relative group">
                        <button className="rounded-full bg-[#FF1C1C] px-3 py-1.5 font-bold text-white transition-transform hover:scale-105 sm:px-5 sm:py-2">
                            {usuario.nome}
                        </button>

                        <div className="absolute right-0 top-full z-50 hidden w-40 pt-2 group-hover:block group-focus-within:block">
                            <div className="rounded-md bg-white p-2 shadow-lg">
                                <button
                                    onClick={deslogar}
                                    className="w-full rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Deslogar
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link to="/login" className="rounded-full bg-[#FF1C1C] px-3 py-1.5 font-bold text-white transition-transform hover:scale-105 sm:px-5 sm:py-2">
                        LOGIN
                    </Link>
                )}

            </div>
        </header>
    )
}

export default Header
