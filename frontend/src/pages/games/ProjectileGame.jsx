
import { useState, useMemo, useEffect, useRef } from "react"
import Header from "../../components/header"

// Configuração do alvo: "terrestre" ou "aereo"
const TIPO_POKEMON = "terrestre"

// Limites possíveis para a posição do Pokémon
const FAIXA_TERRESTRE = [72, 88]
const FAIXA_AEREA = [65, 88]

function ProjectileGame() {
    const [angulo, setAngulo] = useState(45)
    const [velocidade, setVelocidade] = useState(20)
    const [gravidade, setGravidade] = useState(10)

    // Estados do lançamento
    const [lancamento, setLancamento] = useState(null)
    const [posicaoBola, setPosicaoBola] = useState(null)
    const [pokemonCapturado, setPokemonCapturado] = useState(false)

    // Referências dos elementos da arena
    const arenaRef = useRef(null)
    const bolaRef = useRef(null)
    const pokemonRef = useRef(null)

    // Posição do Pokémon definida uma única vez
    const [pokemonX] = useState(() => {
        const faixa = TIPO_POKEMON === "terrestre"
            ? FAIXA_TERRESTRE
            : FAIXA_AEREA

        return faixa[0] + Math.random() * (faixa[1] - faixa[0])
    })

    // Parâmetros congelados durante o lançamento
    const parametros = lancamento || {
        angulo,
        velocidade,
        gravidade
    }

    // Coordenadas da trajetória prevista
    const trajetoria = useMemo(() => {
        const pontos = []
        const theta = (parametros.angulo * Math.PI) / 180

        const escalaX = 8
        const escalaY = 6

        const inicioX = 80
        const inicioY = 400

        // A linha visual mostra somente uma parte da trajetória
        const duracao = 1.8
        const quantidadePontos = 35

        for (let i = 0; i <= quantidadePontos; i++) {
            const t = (i / quantidadePontos) * duracao

            const x = parametros.velocidade * Math.cos(theta) * t
            const y = parametros.velocidade * Math.sin(theta) * t
                - (parametros.gravidade * t * t) / 2

            const px = inicioX + x * escalaX
            const py = inicioY - y * escalaY

            if (px > 1000 || py < 0 || py > 420) break

            pontos.push(`${px},${py}`)
        }

        return pontos.join(" ")
    }, [parametros])

    // Animação e detecção de colisão
    useEffect(() => {
        if (!lancamento) return

        const theta = (lancamento.angulo * Math.PI) / 180

        const inicioX = 80
        const inicioY = 400

        const escalaX = 8
        const escalaY = 6

        // Tempo necessário para retornar à altura inicial
        const duracao = lancamento.gravidade > 0
            ? (2 * lancamento.velocidade * Math.sin(theta)) / lancamento.gravidade
            : 0

        let inicioTempo = null
        let frameId

        function animar(timestamp) {
            if (inicioTempo === null) {
                inicioTempo = timestamp
            }

            const tempoDecorrido = (timestamp - inicioTempo) / 1000
            const t = Math.min(tempoDecorrido, duracao)

            // Equações do lançamento oblíquo
            const x = lancamento.velocidade * Math.cos(theta) * t
            const y = lancamento.velocidade * Math.sin(theta) * t
                - (lancamento.gravidade * t * t) / 2

            const px = inicioX + x * escalaX
            const py = inicioY - y * escalaY

            // Atualiza a posição da Pokébola
            setPosicaoBola({ x: px, y: py })

            // Verifica colisão
            if (
                !pokemonCapturado &&
                arenaRef.current &&
                bolaRef.current &&
                pokemonRef.current
            ) {
                const arenaRect = arenaRef.current.getBoundingClientRect()
                const pokemonRect = pokemonRef.current.getBoundingClientRect()

                // Coordenadas da Pokébola em pixels relativos à arena
                const bolaX = (px / 1000) * arenaRect.width
                const bolaY = (py / 420) * arenaRect.height

                // Centro do Pokémon
                const pokemonXCentro =
                    pokemonRect.left - arenaRect.left + pokemonRect.width / 2

                const pokemonYCentro =
                    pokemonRect.top - arenaRect.top + pokemonRect.height / 2

                const distancia = Math.hypot(
                    bolaX - pokemonXCentro,
                    bolaY - pokemonYCentro
                )

                // Raios aproximados dos elementos
                const raioBola = Math.max(
                    bolaRef.current.offsetWidth,
                    bolaRef.current.offsetHeight
                ) / 2

                const raioPokemon = Math.max(
                    pokemonRect.width,
                    pokemonRect.height
                ) / 2

                if (distancia <= raioBola + raioPokemon) {
                    setPokemonCapturado(true)
                    return
                }
            }

            // Continua até retornar à altura inicial
            if (t < duracao) {
                frameId = requestAnimationFrame(animar)
            }
        }

        if (duracao > 0) {
            frameId = requestAnimationFrame(animar)
        } else {
            setPosicaoBola({ x: inicioX, y: inicioY })
        }

        return () => cancelAnimationFrame(frameId)

    }, [lancamento])

    // Inicia o lançamento
    function lancarPokebola() {
        if (lancamento) return

        setPosicaoBola(null)

        setLancamento({
            angulo,
            velocidade,
            gravidade
        })
    }

    // Retorna a Pokébola ao ponto inicial
    function voltarPokebola() {
        setLancamento(null)
        setPosicaoBola(null)
        setPokemonCapturado(false)
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#0F1730] text-white">
            <Header />
            <main className="flex flex-1 items-center justify-center px-3 py-6 sm:px-6">
                <div className="w-full max-w-5xl">
                    <div
                        ref={arenaRef}
                        className="relative aspect-[2.2/1] min-h-[250px] w-full overflow-hidden rounded-t-lg bg-[#858585]"                   >
                        <div className="absolute bottom-0 h-[8px] w-full bg-[#555555]" />
                        <svg
                            viewBox="0 0 1000 420"
                            preserveAspectRatio="none"
                            className="absolute inset-0 h-full w-full">
                            <polyline
                                points={trajetoria}
                                fill="none"
                                stroke="#FFFFFF"
                                strokeWidth="3"
                                strokeDasharray="9 8"
                                strokeLinecap="round"
                                strokeLinejoin="round"/>
                        </svg>
                        <div
                            ref={bolaRef}
                            className="absolute z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-800 bg-red-500 text-[8px] font-bold text-white sm:h-12 sm:w-12"
                            style={
                                posicaoBola
                                    ? {
                                        left: `${posicaoBola.x / 10}%`,
                                        top: `${(posicaoBola.y / 420) * 100}%`,
                                        transform: "translate(-50%, -50%)"
                                    }
                                    : {
                                        left: "8%",
                                        bottom: "8px",
                                        transform: "translate(-50%, 0)"
                                    }
                            }
                            title="Pokébola">
                            bola
                        </div>
                        {!pokemonCapturado && (
                            <div
                                ref={pokemonRef}
                                className="absolute z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white/70 bg-[#29395D] text-[8px] font-bold text-white sm:h-16 sm:w-16"
                                style={{
                                    left: `${pokemonX}%`,
                                    bottom: TIPO_POKEMON === "terrestre"
                                        ? "8px"
                                        : "35%"
                                }}
                                title={`Pokémon ${TIPO_POKEMON}`}>
                                pokemon
                            </div>
                        )}
                        <button
                            onClick={lancamento ? voltarPokebola : lancarPokebola}
                            className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-[#4779E8] px-5 py-1.5 text-xs font-semibold transition-colors hover:bg-blue-600 sm:px-8 sm:text-sm"
                        >
                            {lancamento ? "VOLTAR POKEBOLA" : "LANÇAR POKEBOLA"}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 rounded-b-lg bg-[#17264B] p-3 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] sm:p-4">
                        <div className="flex flex-col justify-around gap-3">
                            <div>
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <label>Ângulo (θ)</label>
                                    <span>{angulo}°</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="90"
                                    value={angulo}
                                    disabled={!!lancamento}
                                    onChange={(e) => setAngulo(Number(e.target.value))}
                                    className="w-full accent-[#4779E8] disabled:opacity-50"/>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <label>Velocidade inicial (v₀)</label>
                                    <span>{velocidade} m/s</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="30"
                                    value={velocidade}
                                    disabled={!!lancamento}
                                    onChange={(e) => setVelocidade(Number(e.target.value))}
                                    className="w-full accent-[#4779E8] disabled:opacity-50"/>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <label>Gravidade (g)</label>
                                    <span>{gravidade} m/s²</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={gravidade}
                                    disabled={!!lancamento}
                                    onChange={(e) => setGravidade(Number(e.target.value))}
                                    className="w-full accent-[#4779E8] disabled:opacity-50"/>
                            </div>
                        </div>
                        <div className="rounded bg-[#29395D] p-3 text-[11px] leading-relaxed sm:text-xs">
                            Neste minigame, você deve arremessar uma pokebola no pokémon, o objetivo é analisar e compreender como funciona um arremesso obliquo
                            <br />
                            A distância horizontal e altura máxima se comportam de maneiras diferentes, o ângulo que satisfaz a maior distância para uma mesma velocidade inicial é exatamente 45°, teste isso:
                            <br />
                            Mantenha uma velocidade inicial fixa, exemplo: 20m/s. Em seguida, coloque ângulos quaisquer, como 30° ou 60°, e por último coloque 45°, você verá que 45° foi mais longe que os demais
                            A cinética está associada ao movimento do corpo.
                            <br />
                            O arremesso adquire uma forma de parábola devido o efeito da gravidade, onde a pokebola vai ao ar com uma velocidade num vetor vertical, essa velocidade diminui até inverter seu sinal e começar a cancelAnimationFrame
                            <br />
                            Se divirta e capture muitos pokémons!
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProjectileGame
