import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ProjectileGame from "./pages/games/ProjectileGame"
import Register from "./pages/Register"
import Login from "./pages/Login"
import { useEffect } from "react"


function App() {
  useEffect(() => {
    fetch("http://localhost:5000/")
      .then(res => res.json())
      .then(data => console.log("Flask:", data))
      .catch(error => console.error("Erro de conexão:", error))
  }, [])
  
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game/2" element={<ProjectileGame />}></Route>
      </Routes>
      
  )
}

export default App