import logo from "../assets/pokeball.png"
import { Link } from "react-router-dom"

function Header(){
    return (
        <header className="h-[128px] bg-[#18244B] flex justify-between items-center px-8">
            <Link to="/" className="flex items-center">
                <img src={logo} alt="logo" className="w-[64px] h-[64px] ml-[32px] mr-[32px]"/>
                <div className="items-baseline flex text-[#EEFF07] [-webkit-text-stroke:2px_#0800E2] text-[30px]" style={{ fontFamily: "'Luckiest Guy', cursive" }}>
                    <span>P</span>
                    <span className="text-[22px]">o</span>
                    <span>k</span>
                    <span className="text-[22px]">é</span>
                    <span>n</span>
                    <span className="text-[22px]">e</span>
                    <span className="text-[22px]">w</span>
                    <span>t</span>
                    <span className="text-[22px]">o</span>
                    <span>n</span>
                </div>
            </Link>
            <div className="flex items-center mr-[64px] text-[20px]" style={{ fontFamily: "'Inter', sans-serif"}}>
                <Link to ="/" className="mr-[32px] text-[#FFFFFF]">INÍCIO</Link>
                <Link to="minigames" className="mr-[32px]">MINIJOGOS</Link>
                <Link to="login" className="text-[#FFFFFF] bg-[#FF1C1C] rounded-[24px] p-[12px] px-[16px]">LOGIN</Link>
            </div>
        </header>
        
    )
}

export default Header