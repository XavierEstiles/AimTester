import { useEffect, useState } from 'react'
import '../../App.css'
import GameHeader from '../../components/GameHeader/GameHeader'
import GameMenu from '../../components/GameMenu/GameMenu'
import GameModal from '../../components/GameModal/GameModal'
import Tablero from '../../components/Tablero/Tablero'
import Informacion from '../../components/Informacion/Informacion'
import TestControls from '../../components/TestControls/TestControls'

const Game = ({ onLogout }) => {
  const [puntos, setPuntos] = useState(0)
  const [fallos, setFallos] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(true)

  useEffect(() => {
    if (!isPlaying) {
      return undefined
    }

    const timer = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          setIsPlaying(false)
          setIsModalOpen(true)
          return 0
        }

        return currentTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying])

  const iniciarPrueba = () => {
    setPuntos(0)
    setFallos(0)
    setTimeLeft(30)
    setIsPlaying(true)
    setIsModalOpen(false)
  }

  return (
    <main className="app">
      <GameMenu onLogout={onLogout} />
      <GameHeader />
      <TestControls timeLeft={timeLeft} isPlaying={isPlaying} onStart={() => setIsModalOpen(true)} />
      <Informacion puntos={puntos} fallos={fallos} />
      <div className="board-stage">
        <Tablero isPlaying={isPlaying} setPuntos={setPuntos} setFallos={setFallos} />
        {isModalOpen && <GameModal timeLeft={timeLeft} puntos={puntos} fallos={fallos} onStart={iniciarPrueba} />}
      </div>
    </main>
  )
}

export default Game
