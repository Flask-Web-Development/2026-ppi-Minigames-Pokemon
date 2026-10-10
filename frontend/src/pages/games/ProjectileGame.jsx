import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "../../components/header"
import minigames from "../../data/minigames"

function ProjectileGame() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [userX, setUserX] = useState(0)
    const [userY, setUserY] = useState(0)
    const [targetX, setTargetX] = useState(300)
    const [targetY, setTargetY] = useState(0)
  
    return (
    <div className="flex min-h-screen w-full flex-col bg-[#0F1730] text-white">
        <Header />

        <div className="flex flex-1 flex-col items-center justify-center p-6">
            <p className="">Rascunho: arremesso de pokébolas</p>
            <div className="w-[600px] h-[350px] bg-gray-900 border border-gray-700 rounded-xl relative">

            </div>
        </div>
    </div>
  )
}

export default ProjectileGame