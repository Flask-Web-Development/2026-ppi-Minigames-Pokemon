import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ProjectileGame from "./pages/games/ProjectileGame"


function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/game/2" element={<ProjectileGame />}></Route>
      </Routes>
  )
}

export default App