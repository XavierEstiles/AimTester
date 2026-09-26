import { useEffect, useRef, useState } from 'react'
import '../../App.css'
import GameHeader from '../../components/GameHeader/GameHeader'
import GameMenu from '../../components/GameMenu/GameMenu'
import GameModal from '../../components/GameModal/GameModal'
import Tablero from '../../components/Tablero/Tablero'
import Informacion from '../../components/Informacion/Informacion'
import TestControls from '../../components/TestControls/TestControls'
import { saveMatch } from '../../services/matches'

const MATCH_SECONDS = 30
const MATCH_MODE = 'classic_30s'

const Game = ({ onLogout }) => {
  const [puntos, setPuntos] = useState(0)
  const [fallos, setFallos] = useState(0)
  const [timeLeft, setTimeLeft] = useState(MATCH_SECONDS)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [saveState, setSaveState] = useState(null)
  const roundSaved = useRef(false)

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

  // Guarda la partida exactamente una vez cuando se acaba el tiempo.
  useEffect(() => {
    if (isPlaying || timeLeft !== 0 || roundSaved.current) {
      return undefined
    }

    roundSaved.current = true
    setSaveState('saving')

    saveMatch({
      mode: MATCH_MODE,
      durationSeconds: MATCH_SECONDS,
      hits: puntos,
      misses: fallos,
    })
      .then(() => setSaveState('saved'))
      .catch(() => setSaveState('error'))

    return undefined
  }, [isPlaying, timeLeft, puntos, fallos])

  const iniciarPrueba = () => {
    roundSaved.current = false
    setSaveState(null)
    setPuntos(0)
    setFallos(0)
    setTimeLeft(MATCH_SECONDS)
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
        {isModalOpen && (
          <GameModal
            timeLeft={timeLeft}
            puntos={puntos}
            fallos={fallos}
            saveState={saveState}
            onStart={iniciarPrueba}
          />
        )}
      </div>
    </main>
  )
}

export default Game
