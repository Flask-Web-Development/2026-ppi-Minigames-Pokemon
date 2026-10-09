import { useNavigate } from "react-router-dom";
import QuestionMarkImg from "../assets/QuestionMark.png"

function MinigameCard({ minigame, onClick }) {
    const navigate = useNavigate()
    
    const handleCardClick = () => {
        navigate(`/game/${minigame.id}`)
    }
    
    return (
      <article
        onClick={handleCardClick}
        className="relative flex aspect-[248/353] w-full cursor-pointer flex-col overflow-hidden rounded-2xl mr-[21px] ml[21px] mb-[21px]"
      >
        <div className="relative flex-1 bg-[#7F7F7F]">
          {minigame.image && minigame.image !== '...' && (
            <img
              src={minigame.image}
              alt={`Poster de ${minigame.title}`}
              className="h-full w-full object-cover"
            />
          )}
  
          <div className="group absolute right-3 top-3">
            <button
              type="button"
              aria-label={`Mais informações sobre ${minigame.title}`}
              onClick={(event) => event.stopPropagation()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 p-1 backdrop-blur-sm"
            >
              <img
                src={QuestionMarkImg}
                alt=""
                className="h-full w-full object-contain"
              />
            </button>
  
            <div className="pointer-events-none absolute right-0 top-full z-10 mt-2 hidden w-56 rounded-lg bg-white p-3 text-sm text-gray-900 shadow-lg group-hover:block">
              {minigame.details || minigame.description}
            </div>
          </div>
        </div>
  
        <div
          className="flex min-h-[120px] flex-col items-center justify-center p-4 text-center text-white"
          style={{ backgroundColor: minigame.color }}
        >
          <h2 className="text-base font-bold leading-tight">
            {minigame.title}
          </h2>
          <p className="mt-2 text-xs font-medium opacity-90">
            {minigame.description}
          </p>
        </div>
      </article>
    );
  }
  
  export default MinigameCard;