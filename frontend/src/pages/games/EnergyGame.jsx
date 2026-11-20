
import { useState, useRef, useEffect } from "react"
import Header from "../../components/header"

const PISTAS = {
    rampa: {
        nome: "Rampa",
        caminho: "M 80 100 C 230 100 250 330 430 330 L 920 330",
        inicio: { x: 106, y: 76.5 }
    },

    vale: {
        nome: "Vale",
        caminho: "M 80 100 C 250 100 260 330 500 330 C 740 330 750 100 920 100",
        inicio: { x: 108, y: 76.5 }
    }
}

const RAIO_POKEMON = 19
const RAIO_PISTA = 6.5
const DISTANCIA_CONTATO = RAIO_POKEMON + RAIO_PISTA
const ESCALA_PX_METRO = 30
const ALTURA_REFERENCIA = 401

function EnergyGame() {
    const [pistaSelecionada, setPistaSelecionada] = useState("rampa")
    const [massa, setMassa] = useState(1)
    const [friccao, setFriccao] = useState(0)
    const [gravidade, setGravidade] = useState(9.8)

    const [mostrarGrafico, setMostrarGrafico] = useState(false)
    const [mostrarRegua, setMostrarRegua] = useState(false)
    const [mostrarVetores, setMostrarVetores] = useState(false)

    const [executando, setExecutando] = useState(false)
    const [arrastando, setArrastando] = useState(false)

    const [anguloBola, setAnguloBola] = useState(0)

    const [posicaoPokemon, setPosicaoPokemon] = useState({
        x: 106,
        y: 76.5
    })

    const [energias, setEnergias] = useState({
        potencial: 0,
        cinetica: 0,
        termica: 0
    })

    const svgRef = useRef(null)
    const pistaRef = useRef(null)

    const deslocamentoArraste = useRef({ x: 0, y: 0 })

    const posicaoRef = useRef(posicaoPokemon)
    const velocidadeRef = useRef({ x: 0, y: 0 })

    const animationRef = useRef(null)

    const emContatoRef = useRef(false)
    const distanciaPistaRef = useRef(null)
    const normalPistaRef = useRef(null)

    const rotacaoRef = useRef(0)
    const anguloBolaRef = useRef(0)

    const energiaInicialRef = useRef(null)
    const simulacaoIniciadaRef = useRef(false)

    const pista = PISTAS[pistaSelecionada]

    function obterPontoSVG(event) {
        const rect = svgRef.current.getBoundingClientRect()

        return {
            x: (event.clientX - rect.left) * (1000 / rect.width),
            y: (event.clientY - rect.top) * (420 / rect.height)
        }
    }

    function calcularEnergias(posicao, velocidade) {
        const altura = Math.max(
            0,
            (ALTURA_REFERENCIA - posicao.y) / ESCALA_PX_METRO
        )

        const velocidadeLinear = Math.hypot(
            velocidade.x,
            velocidade.y
        ) / ESCALA_PX_METRO

        const raioMetros = RAIO_POKEMON / ESCALA_PX_METRO

        const potencial = massa * gravidade * altura

        const cinetica =
            0.5 * massa * velocidadeLinear ** 2 +
            0.2 * massa *
            (raioMetros * rotacaoRef.current) ** 2

        const referencia = energiaInicialRef.current ??
            potencial + cinetica

        const termica = Math.max(
            0,
            referencia - potencial - cinetica
        )

        return {
            potencial,
            cinetica,
            termica
        }
    }

    function reiniciarEstadoFisico(novaPosicao) {
        posicaoRef.current = novaPosicao
        velocidadeRef.current = { x: 0, y: 0 }

        emContatoRef.current = false
        distanciaPistaRef.current = null
        normalPistaRef.current = null

        rotacaoRef.current = 0
        energiaInicialRef.current = null
        simulacaoIniciadaRef.current = false

        setPosicaoPokemon(novaPosicao)
        setEnergias(
            calcularEnergias(novaPosicao, { x: 0, y: 0 })
        )
        anguloBolaRef.current = 0
    setAnguloBola(0)
    }

    function iniciarArraste(event) {
        if (executando) return

        event.preventDefault()

        reiniciarEstadoFisico(posicaoRef.current)

        const ponto = obterPontoSVG(event)

        deslocamentoArraste.current = {
            x: ponto.x - posicaoRef.current.x,
            y: ponto.y - posicaoRef.current.y
        }

        svgRef.current.setPointerCapture(event.pointerId)
        setArrastando(true)
    }

    function arrastarPokemon(event) {
        if (!arrastando || executando) return

        const ponto = obterPontoSVG(event)

        const novaPosicao = {
            x: Math.max(
                RAIO_POKEMON,
                Math.min(
                    1000 - RAIO_POKEMON,
                    ponto.x - deslocamentoArraste.current.x
                )
            ),

            y: Math.max(
                RAIO_POKEMON,
                Math.min(
                    420 - RAIO_POKEMON,
                    ponto.y - deslocamentoArraste.current.y
                )
            )
        }

        posicaoRef.current = novaPosicao
        setPosicaoPokemon(novaPosicao)

        setEnergias(
            calcularEnergias(novaPosicao, velocidadeRef.current)
        )
    }

    function finalizarArraste() {
        setArrastando(false)
    }

    function geometriaNoPercurso(
        distancia,
        normalReferencia = null,
        posicaoReferencia = null
    ) {
        const caminho = pistaRef.current

        if (!caminho) return null

        const comprimento = caminho.getTotalLength()

        const s = Math.max(
            0,
            Math.min(comprimento, distancia)
        )

        const ponto = caminho.getPointAtLength(s)

        const antes = caminho.getPointAtLength(
            Math.max(0, s - 2)
        )

        const depois = caminho.getPointAtLength(
            Math.min(comprimento, s + 2)
        )

        const dx = depois.x - antes.x
        const dy = depois.y - antes.y

        const modulo = Math.hypot(dx, dy)

        if (modulo === 0) return null

        const tangente = {
            x: dx / modulo,
            y: dy / modulo
        }

        let normal = {
            x: -tangente.y,
            y: tangente.x
        }

        if (normalReferencia) {
            const produto =
                normal.x * normalReferencia.x +
                normal.y * normalReferencia.y

            if (produto < 0) {
                normal.x *= -1
                normal.y *= -1
            }
        } else if (posicaoReferencia) {
            const lado =
                (posicaoReferencia.x - ponto.x) * normal.x +
                (posicaoReferencia.y - ponto.y) * normal.y

            if (lado < 0) {
                normal.x *= -1
                normal.y *= -1
            }
        } else if (normal.y > 0) {
            normal.x *= -1
            normal.y *= -1
        }

        const distanciaPokemon = posicaoReferencia
            ? Math.hypot(
                posicaoReferencia.x - ponto.x,
                posicaoReferencia.y - ponto.y
            )
            : null

        return {
            ponto: {
                x: ponto.x,
                y: ponto.y,
                distanciaPercorrida: s
            },
            distancia: distanciaPokemon,
            tangente,
            normal,
            comprimento
        }
    }

    function encontrarPontoMaisProximo(x, y) {
        const caminho = pistaRef.current

        if (!caminho) return null

        const comprimento = caminho.getTotalLength()
        const quantidadeAmostras = 500

        let melhorDistancia = Infinity
        let melhorPercurso = 0

        for (let i = 0; i <= quantidadeAmostras; i++) {
            const percurso =
                (i / quantidadeAmostras) * comprimento

            const ponto = caminho.getPointAtLength(percurso)

            const distancia = Math.hypot(
                x - ponto.x,
                y - ponto.y
            )

            if (distancia < melhorDistancia) {
                melhorDistancia = distancia
                melhorPercurso = percurso
            }
        }

        return geometriaNoPercurso(
            melhorPercurso,
            null,
            { x, y }
        )
    }

    function calcularCurvatura(geometria) {
        const s = geometria.ponto.distanciaPercorrida
        const limite = geometria.comprimento

        const antes = geometriaNoPercurso(
            Math.max(0, s - 3),
            geometria.normal
        )

        const depois = geometriaNoPercurso(
            Math.min(limite, s + 3),
            geometria.normal
        )

        if (!antes || !depois) return 0

        const intervalo =
            depois.ponto.distanciaPercorrida -
            antes.ponto.distanciaPercorrida

        if (intervalo === 0) return 0

        const variacaoX =
            depois.tangente.x - antes.tangente.x

        const variacaoY =
            depois.tangente.y - antes.tangente.y

        return (
            variacaoX * geometria.normal.x +
            variacaoY * geometria.normal.y
        ) / intervalo
    }

    function podeManterContato(geometria, velocidade) {
        if (!geometria) return false

        const tangente = geometria.tangente
        const normal = geometria.normal

        const velocidadeNormal =
            velocidade.x * normal.x +
            velocidade.y * normal.y

        const velocidadeTangencial =
            velocidade.x * tangente.x +
            velocidade.y * tangente.y

        const gravidadeNormal =
            gravidade * ESCALA_PX_METRO * normal.y

        const curvatura = calcularCurvatura(geometria)

        const aceleracaoNormalNecessaria =
            velocidadeTangencial ** 2 * curvatura

        const forcaNormal =
            aceleracaoNormalNecessaria - gravidadeNormal

        return (
            geometria.distancia <= DISTANCIA_CONTATO + 1 &&
            velocidadeNormal <= 1 &&
            forcaNormal >= -0.5
        )
    }

    function selecionarPista(id) {
        if (executando || simulacaoIniciadaRef.current) return

        setPistaSelecionada(id)

        reiniciarEstadoFisico(PISTAS[id].inicio)
    }

    function alternarSimulacao() {
        if (!executando && !simulacaoIniciadaRef.current) {
            const valores = calcularEnergias(
                posicaoRef.current,
                velocidadeRef.current
            )

            energiaInicialRef.current =
                valores.potencial + valores.cinetica

            simulacaoIniciadaRef.current = true
        }

        setArrastando(false)
        setExecutando(atual => !atual)
    }

    useEffect(() => {
        if (!executando) return

        let ultimoTempo = null

        function animar(timestamp) {
            if (ultimoTempo === null) {
                ultimoTempo = timestamp
            }

            const deltaTempo = Math.min(
                (timestamp - ultimoTempo) / 1000,
                0.04
            )

            ultimoTempo = timestamp

            const gravidadePixel =
                gravidade * ESCALA_PX_METRO

            let posicao = { ...posicaoRef.current }
            let velocidade = { ...velocidadeRef.current }

            let processouContato = false
            let chegouAoChao = false

            if (
                emContatoRef.current &&
                distanciaPistaRef.current !== null
            ) {
                const geometria = geometriaNoPercurso(
                    distanciaPistaRef.current,
                    normalPistaRef.current,
                    posicao
                )

                if (!geometria) {
                    emContatoRef.current = false
                    distanciaPistaRef.current = null
                    normalPistaRef.current = null
                } else {
                    const tangente = geometria.tangente
                    const normal = geometria.normal

                    posicao = {
                        x: geometria.ponto.x +
                            normal.x * DISTANCIA_CONTATO,
                        y: geometria.ponto.y +
                            normal.y * DISTANCIA_CONTATO
                    }

                    const velocidadeTangencial =
                        velocidade.x * tangente.x +
                        velocidade.y * tangente.y

                    const aceleracaoNormalNecessaria =
                        velocidadeTangencial ** 2 *
                        calcularCurvatura(geometria)

                    const gravidadeNormal =
                        gravidadePixel * normal.y

                    const forcaNormal =
                        aceleracaoNormalNecessaria -
                        gravidadeNormal

                    const s = geometria.ponto.distanciaPercorrida

                    const saiuPeloInicio =
                        s <= 0.5 && velocidadeTangencial < -0.5

                    const saiuPeloFinal =
                        s >= geometria.comprimento - 0.5 &&
                        velocidadeTangencial > 0.5

                    if (
                        forcaNormal < -0.5 ||
                        saiuPeloInicio ||
                        saiuPeloFinal
                    ) {
                        emContatoRef.current = false
                        distanciaPistaRef.current = null
                        normalPistaRef.current = null

                        velocidade = {
                            x: tangente.x * velocidadeTangencial,
                            y: tangente.y * velocidadeTangencial
                        }

                        processouContato = true
                    } else {
                        const aceleracaoGravitacional =
                            (5 / 7) *
                            gravidadePixel *
                            tangente.y

                        const aceleracaoResistencia =
                            friccao *
                            gravidadePixel *
                            Math.abs(normal.y)

                        let aceleracaoTangencial

                        if (Math.abs(velocidadeTangencial) < 0.05) {
                            aceleracaoTangencial =
                                Math.abs(aceleracaoGravitacional) >
                                aceleracaoResistencia
                                    ? aceleracaoGravitacional -
                                      Math.sign(aceleracaoGravitacional) *
                                      aceleracaoResistencia
                                    : 0
                        } else {
                            aceleracaoTangencial =
                                aceleracaoGravitacional -
                                Math.sign(velocidadeTangencial) *
                                aceleracaoResistencia
                        }

                        let novaVelocidadeTangencial =
                            velocidadeTangencial +
                            aceleracaoTangencial * deltaTempo

                        let deslocamento =
                            velocidadeTangencial * deltaTempo +
                            0.5 *
                            aceleracaoTangencial *
                            deltaTempo ** 2

                        if (
                            velocidadeTangencial !== 0 &&
                            velocidadeTangencial *
                            novaVelocidadeTangencial < 0
                        ) {
                            deslocamento =
                                -(velocidadeTangencial ** 2) /
                                (2 * aceleracaoTangencial)

                            novaVelocidadeTangencial = 0
                        }

                        const novoPercurso =
                            s + deslocamento

                        const percursoLimitado = Math.max(
                            0,
                            Math.min(
                                geometria.comprimento,
                                novoPercurso
                            )
                        )

                        const geometriaNova =
                            geometriaNoPercurso(
                                percursoLimitado,
                                normal
                            )

                        if (!geometriaNova) {
                            emContatoRef.current = false
                            processouContato = true
                        } else {
                            posicao = {
                                x: geometriaNova.ponto.x +
                                    geometriaNova.normal.x *
                                    DISTANCIA_CONTATO,

                                y: geometriaNova.ponto.y +
                                    geometriaNova.normal.y *
                                    DISTANCIA_CONTATO
                            }

                            velocidade = {
                                x: geometriaNova.tangente.x *
                                    novaVelocidadeTangencial,

                                y: geometriaNova.tangente.y *
                                    novaVelocidadeTangencial
                            }

                            rotacaoRef.current =
                                novaVelocidadeTangencial /
                                RAIO_POKEMON

                            if (
                                novoPercurso < 0 ||
                                novoPercurso > geometria.comprimento
                            ) {
                                emContatoRef.current = false
                                distanciaPistaRef.current = null
                                normalPistaRef.current = null
                            } else {
                                distanciaPistaRef.current =
                                    percursoLimitado

                                normalPistaRef.current =
                                    geometriaNova.normal
                            }

                            processouContato = true
                        }
                    }
                }
            }

            if (!processouContato) {
                const novaVelocidade = {
                    x: velocidade.x,
                    y: velocidade.y +
                        gravidadePixel * deltaTempo
                }

                const novaPosicao = {
                    x: posicao.x +
                        novaVelocidade.x * deltaTempo,

                    y: posicao.y +
                        novaVelocidade.y * deltaTempo
                }

                const geometriaColisao =
                    encontrarPontoMaisProximo(
                        novaPosicao.x,
                        novaPosicao.y
                    )

                if (
                    geometriaColisao &&
                    podeManterContato(
                        geometriaColisao,
                        novaVelocidade
                    )
                ) {
                    const tangente = geometriaColisao.tangente
                    const normal = geometriaColisao.normal

                    const velocidadeAntes =
                        novaVelocidade.x * tangente.x +
                        novaVelocidade.y * tangente.y

                    const velocidadeDepois =
                        (
                            5 * velocidadeAntes +
                            2 * RAIO_POKEMON *
                            rotacaoRef.current
                        ) / 7

                    posicao = {
                        x: geometriaColisao.ponto.x +
                            normal.x * DISTANCIA_CONTATO,

                        y: geometriaColisao.ponto.y +
                            normal.y * DISTANCIA_CONTATO
                    }

                    velocidade = {
                        x: tangente.x * velocidadeDepois,
                        y: tangente.y * velocidadeDepois
                    }

                    rotacaoRef.current =
                        velocidadeDepois / RAIO_POKEMON

                    emContatoRef.current = true

                    distanciaPistaRef.current =
                        geometriaColisao.ponto.distanciaPercorrida

                    normalPistaRef.current = normal
                } else {
                    posicao = novaPosicao
                    velocidade = novaVelocidade

                    if (
                        posicao.y >= ALTURA_REFERENCIA
                    ) {
                        posicao.y = ALTURA_REFERENCIA

                        velocidade = {
                            x: 0,
                            y: 0
                        }

                        rotacaoRef.current = 0
                        emContatoRef.current = false

                        chegouAoChao = true
                    }
                }
            }

            anguloBolaRef.current += rotacaoRef.current * deltaTempo

            setAnguloBola(anguloBolaRef.current)

            posicaoRef.current = posicao
            velocidadeRef.current = velocidade

            setPosicaoPokemon(posicao)
            setEnergias(calcularEnergias(posicao, velocidade))

            if (chegouAoChao) {
                setExecutando(false)
                return
            }

            animationRef.current =
                requestAnimationFrame(animar)
        }

        animationRef.current =
            requestAnimationFrame(animar)

        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [executando, gravidade, friccao, pistaSelecionada, massa])

    const energiaTotal = Math.max(
        energiaInicialRef.current ??
        (
            energias.potencial +
            energias.cinetica +
            energias.termica
        ),
        0.000001
    )

    const barrasEnergia = [
        {
            nome: "Ep",
            cor: "#36CE77",
            valor: energias.potencial
        },
        {
            nome: "Ec",
            cor: "#F2CE48",
            valor: energias.cinetica
        },
        {
            nome: "Et",
            cor: "#FF704A",
            valor: energias.termica
        }
    ]

    const velocidadeX = velocidadeRef.current.x
    const velocidadeY = velocidadeRef.current.y

    const velocidadeModulo = Math.hypot(
        velocidadeX,
        velocidadeY
    )

    const comprimentoVetor = Math.min(
        100,
        velocidadeModulo * 0.12
    )

    const pontaVetor = {
        x: posicaoPokemon.x +
            (velocidadeModulo > 0
                ? velocidadeX / velocidadeModulo * comprimentoVetor
                : 0),

        y: posicaoPokemon.y +
            (velocidadeModulo > 0
                ? velocidadeY / velocidadeModulo * comprimentoVetor
                : 0)
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#0F1730] text-white">
            <Header />

            <main className="flex flex-1 items-center justify-center px-3 py-6 sm:px-6">
                <div className="w-full max-w-5xl">
                    <div className="relative aspect-[2.2/1] min-h-[250px] w-full overflow-hidden rounded-t-lg bg-[#858585]">

                        <svg
                            ref={svgRef}
                            viewBox="0 0 1000 420"
                            preserveAspectRatio="none"
                            className="absolute inset-0 h-full w-full touch-none"
                            onPointerMove={arrastarPokemon}
                            onPointerUp={finalizarArraste}
                            onPointerCancel={finalizarArraste}
                        >
                            <defs>
                                <marker
                                    id="seta-velocidade"
                                    viewBox="0 0 10 10"
                                    refX="8"
                                    refY="5"
                                    markerWidth="5"
                                    markerHeight="5"
                                    orient="auto"
                                >
                                    <path
                                        d="M 0 0 L 10 5 L 0 10 Z"
                                        fill="#FFFFFF"
                                    />
                                </marker>
                            </defs>

                            {mostrarRegua && (
                                <g pointerEvents="none">
                                    {Array.from({ length: 19 }, (_, i) => (
                                        <line
                                            key={`vertical-${i}`}
                                            x1={50 + i * 50}
                                            y1="30"
                                            x2={50 + i * 50}
                                            y2="380"
                                            stroke="white"
                                            strokeWidth="1"
                                            opacity="0.2"
                                        />
                                    ))}

                                    {Array.from({ length: 8 }, (_, i) => (
                                        <line
                                            key={`horizontal-${i}`}
                                            x1="50"
                                            y1={380 - i * 50}
                                            x2="950"
                                            y2={380 - i * 50}
                                            stroke="white"
                                            strokeWidth="1"
                                            opacity="0.2"
                                        />
                                    ))}

                                    <line
                                        x1="50"
                                        y1="380"
                                        x2="970"
                                        y2="380"
                                        stroke="white"
                                        strokeWidth="2"
                                    />

                                    <line
                                        x1="50"
                                        y1="380"
                                        x2="50"
                                        y2="20"
                                        stroke="white"
                                        strokeWidth="2"
                                    />

                                    <path
                                        d="M 970 380 L 958 374 L 958 386 Z"
                                        fill="white"
                                    />

                                    <path
                                        d="M 50 20 L 44 32 L 56 32 Z"
                                        fill="white"
                                    />

                                    {Array.from({ length: 10 }, (_, i) => (
                                        <text
                                            key={`x-label-${i}`}
                                            x={50 + i * 100}
                                            y="398"
                                            fill="white"
                                            fontSize="10"
                                            textAnchor="middle"
                                        >
                                            {i * 100}
                                        </text>
                                    ))}

                                    {Array.from({ length: 4 }, (_, i) => (
                                        <text
                                            key={`y-label-${i}`}
                                            x="40"
                                            y={384 - i * 100}
                                            fill="white"
                                            fontSize="10"
                                            textAnchor="end"
                                        >
                                            {i * 100}
                                        </text>
                                    ))}

                                    <text
                                        x="980"
                                        y="377"
                                        fill="white"
                                        fontSize="13"
                                    >
                                        X
                                    </text>

                                    <text
                                        x="43"
                                        y="15"
                                        fill="white"
                                        fontSize="13"
                                    >
                                        Y
                                    </text>
                                </g>
                            )}

                            <path
                                ref={pistaRef}
                                d={pista.caminho}
                                fill="none"
                                stroke="#555555"
                                strokeWidth="13"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {mostrarVetores && velocidadeModulo > 1 && (
                                <g pointerEvents="none">
                                    <line
                                        x1={posicaoPokemon.x}
                                        y1={posicaoPokemon.y}
                                        x2={pontaVetor.x}
                                        y2={pontaVetor.y}
                                        stroke="white"
                                        strokeWidth="3"
                                        markerEnd="url(#seta-velocidade)"
                                    />

                                    <text
                                        x={pontaVetor.x + 6}
                                        y={pontaVetor.y - 6}
                                        fill="white"
                                        fontSize="14"
                                    >
                                        v
                                    </text>
                                </g>
                            )}
                                <g
                                    transform={`translate(${posicaoPokemon.x}, ${posicaoPokemon.y}) rotate(${anguloBola * 180 / Math.PI})`}
                                    onPointerDown={iniciarArraste}
                                    style={{
                                        cursor: executando
                                            ? "default"
                                            : arrastando
                                                ? "grabbing"
                                                : "grab"
                                    }}
                                >
                                    <circle
                                        r={RAIO_POKEMON}
                                        fill="#F2CE48"
                                    />

                                    <text
                                        x="0"
                                        y="1"
                                        fill="#292929"
                                        fontSize="9"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        PKMN
                                    </text>
                                </g>
                        </svg>

                        <button
                            onClick={alternarSimulacao}
                            className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-[#4779E8] px-5 py-1.5 text-xs font-semibold transition-colors hover:bg-blue-600 sm:px-8 sm:text-sm"
                        >
                            {executando
                                ? "PAUSAR SIMULAÇÃO"
                                : "INICIAR SIMULAÇÃO"}
                        </button>

                        <div className="absolute left-3 top-3 rounded bg-[#29395D]/90 px-3 py-1.5 text-xs font-semibold">
                            {pista.nome}
                        </div>

                        {mostrarGrafico && (
                            <div className="absolute bottom-3 left-3 flex items-end gap-2 rounded bg-[#29395D]/95 p-2">
                                {barrasEnergia.map((energia) => (
                                    <div
                                        key={energia.nome}
                                        className="flex w-10 flex-col items-center gap-1"
                                    >
                                        <div className="relative flex h-24 w-4 items-end overflow-hidden rounded-sm bg-[#161E35]">
                                        <div
                                            className="w-full"
                                            style={{
                                                backgroundColor: energia.cor,
                                                height: `${Math.min(
                                                    100,
                                                    energia.valor / energiaTotal * 100
                                                )}%`
                                            }}
                                        />
                                        </div>

                                        <span className="text-[10px] font-semibold">
                                            {energia.nome}
                                        </span>

                                        <span className="text-[8px] text-gray-300">
                                            {energia.valor.toFixed(1)} J
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 rounded-b-lg bg-[#17264B] p-3 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] sm:p-4">
                        <div className="flex flex-col justify-around gap-4">

                            <div>
                                <div className="mb-2 flex justify-between text-xs sm:text-sm">
                                    <label>Pista</label>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(PISTAS).map(([id, item]) => (
                                        <button
                                            key={id}
                                            disabled={
                                                executando ||
                                                simulacaoIniciadaRef.current
                                            }
                                            onClick={() => selecionarPista(id)}
                                            className={`rounded px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                                pistaSelecionada === id
                                                    ? "bg-[#4779E8]"
                                                    : "bg-[#29395D] hover:bg-[#354979]"
                                            }`}
                                        >
                                            {item.nome}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    {
                                        nome: "Gráfico",
                                        valor: mostrarGrafico,
                                        alterar: setMostrarGrafico
                                    },
                                    {
                                        nome: "Plano cartesiano",
                                        valor: mostrarRegua,
                                        alterar: setMostrarRegua
                                    },
                                    {
                                        nome: "Vetores",
                                        valor: mostrarVetores,
                                        alterar: setMostrarVetores
                                    }
                                ].map((item) => (
                                    <label
                                        key={item.nome}
                                        className="flex cursor-pointer items-center justify-center gap-1 rounded bg-[#29395D] p-2 text-[10px] sm:text-xs"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={item.valor}
                                            onChange={(e) =>
                                                item.alterar(e.target.checked)
                                            }
                                            className="accent-[#4779E8]"
                                        />

                                        {item.nome}
                                    </label>
                                ))}
                            </div>

                            <div>
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <label>Massa</label>
                                    <span>{massa.toFixed(1)} kg</span>
                                </div>

                                <input
                                    type="range"
                                    min="0.5"
                                    max="10"
                                    step="0.5"
                                    value={massa}
                                    disabled={
                                        executando ||
                                        simulacaoIniciadaRef.current
                                    }
                                    onChange={(e) =>
                                        setMassa(Number(e.target.value))
                                    }
                                    className="w-full accent-[#4779E8] disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <label>Resistência ao rolamento</label>
                                    <span>{friccao.toFixed(3)}</span>
                                </div>

                                <input
                                    type="range"
                                    min="0"
                                    max="0.1"
                                    step="0.005"
                                    value={friccao}
                                    disabled={
                                        executando ||
                                        simulacaoIniciadaRef.current
                                    }
                                    onChange={(e) =>
                                        setFriccao(Number(e.target.value))
                                    }
                                    className="w-full accent-[#4779E8] disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <label>Gravidade</label>
                                    <span>{gravidade.toFixed(1)} m/s²</span>
                                </div>

                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    step="0.1"
                                    value={gravidade}
                                    disabled={
                                        executando ||
                                        simulacaoIniciadaRef.current
                                    }
                                    onChange={(e) =>
                                        setGravidade(Number(e.target.value))
                                    }
                                    className="w-full accent-[#4779E8] disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="rounded bg-[#29395D] p-3 text-[11px] leading-relaxed sm:text-xs">
                            Neste minigame, você acompanhará o movimento de
                            um Pokémon esférico por diferentes pistas,
                            observando como as energias se transformam
                            durante o percurso.

                            <br /><br />

                            A energia potencial gravitacional está associada
                            à altura do Pokémon em relação a um referencial.
                            Quanto maior a altura, maior sua energia potencial.

                            <br /><br />

                            A energia cinética está associada ao movimento.
                            Como o Pokémon é esférico e rola, consideramos
                            tanto o movimento de translação quanto o de rotação.

                            <br /><br />

                            A energia térmica representa a energia mecânica
                            dissipada pela resistência ao rolamento e pelas
                            colisões consideradas no modelo.

                            <br /><br />

                            Experimente alterar a massa, a resistência ao
                            rolamento e a gravidade para investigar como
                            esses parâmetros influenciam o comportamento
                            do sistema.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default EnergyGame
