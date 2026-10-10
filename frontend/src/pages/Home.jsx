import Header from "../components/header"
import minigames from "../data/minigames"
import MinigameCard from "../components/MinigameCard"
import ProjectileGame from "./games/ProjectileGame"

function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0F1730]"> 
      <Header />
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-items-center gap-6">
            {minigames.map((minigame) => (
                <MinigameCard
                key={minigame.id}
                minigame={minigame}
                />
            ))}
        </div>
        <ProjectileGame />
      </div>
    </div>
  )
}

export default Home