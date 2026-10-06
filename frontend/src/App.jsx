import Header from "./components/header"


function App() {
  return (
    <div> 
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600">
        <h1 className="text-4xl font-bold text-white">Projeto entregador</h1>
      </div>
    </div>
  )
}

export default App