import logo from "../assets/pokeball.png"
import { Link } from "react-router-dom"

function Header(){
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
                <Link to ="/" className="text-white hover:text-yellow-400">
                INÍCIO</Link>
                <Link to="minigames" className="text-white hover:text-yellow-400">
                MINIJOGOS</Link>
                <Link to="login" className="rounded-full bg-[#FF1C1C] px-3 py-1.5 font-bold text-white transition-transform hover:scale-105 sm:px-5 sm:py-2">
                LOGIN</Link>
            </div>
        </header>
        
    )
}

export default Header