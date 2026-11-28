import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ProjectileGame from "./pages/games/ProjectileGame"
import EnergyGame from "./pages/games/EnergyGame"
import Register from "./pages/Register"
import Login from "./pages/Login"
import { useEffect } from "react"
import API_URL from "./config/api"


function App() {
  useEffect(() => {
    fetch(`${API_URL}/`)
      .then(res => res.json())
      .then(data => console.log("Flask:", data))
      .catch(error => console.error("Erro de conexão:", error))
  }, [])
  
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game/1" element={<EnergyGame />} ></Route>
        <Route path="/game/2" element={<ProjectileGame />}></Route>
      </Routes>
      
  )
}

export default App