import { useEffect, useRef, useState } from 'react'
import '../../App.css'
import GameHeader from '../../components/GameHeader/GameHeader'
import GameMenu from '../../components/GameMenu/GameMenu'
import GameModal from '../../components/GameModal/GameModal'
import Tablero from '../../components/Tablero/Tablero'
import Informacion from '../../components/Informacion/Informacion'
import TestControls from '../../components/TestControls/TestControls'
import { saveMatch } from '../../services/matches'
import { DEFAULT_MODE } from '../../services/modes'

const Game = ({ onLogout }) => {
  const [puntos, setPuntos] = useState(0)
  const [fallos, setFallos] = useState(0)
  const [mode, setMode] = useState(DEFAULT_MODE)
  const [timeLeft, setTimeLeft] = useState(DEFAULT_MODE.durationSeconds)
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
      mode: mode.id,
      durationSeconds: mode.durationSeconds,
      hits: puntos,
      misses: fallos,
    })
      .then(() => setSaveState('saved'))
      .catch(() => setSaveState('error'))

    return undefined
  }, [isPlaying, timeLeft, mode, puntos, fallos])

  // Solo se puede cambiar de modo con la prueba parada (modal abierto).
  const seleccionarModo = (nextMode) => {
    if (isPlaying) {
      return
    }

    setMode(nextMode)
    setTimeLeft(nextMode.durationSeconds)
    setSaveState(null)
    roundSaved.current = false
  }

  const iniciarPrueba = () => {
    roundSaved.current = false
    setSaveState(null)
    setPuntos(0)
    setFallos(0)
    setTimeLeft(mode.durationSeconds)
    setIsPlaying(true)
    setIsModalOpen(false)
  }

  return (
    <main className="app">
      <GameMenu onLogout={onLogout} />
      <GameHeader title="Partida"/>
      <TestControls
        timeLeft={timeLeft}
        total={mode.durationSeconds}
        mode={mode}
        isPlaying={isPlaying}
      />
      <Informacion puntos={puntos} fallos={fallos} />
      <div className="board-stage">
        <Tablero
          isPlaying={isPlaying}
          difficulty={mode.difficulty}
          setPuntos={setPuntos}
          setFallos={setFallos}
        />
        {isModalOpen && (
          <GameModal
            timeLeft={timeLeft}
            puntos={puntos}
            fallos={fallos}
            saveState={saveState}
            mode={mode}
            onSelectMode={seleccionarModo}
            isPlaying={isPlaying}
            onStart={iniciarPrueba}
          />
        )}
      </div>
    </main>
  )
}

export default Game
