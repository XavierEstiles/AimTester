import { useState } from 'react'
import './Tablero.css'

// Posición del objetivo como fracción (0-1) del tablero. Así el objetivo sigue
// dentro del lienzo en cualquier tamaño de pantalla, también en móvil, donde la
// coordenada en píxeles fija se salía del tablero.
const POSICION_INICIAL = { x: 0.5, y: 0.5 }

const Tablero = ({ isPlaying, setPuntos, setFallos, difficulty = 'classic' }) => {
  const [position, setPosition] = useState(POSICION_INICIAL)

  const puntuar = () => {
    if (!isPlaying) {
      return
    }

    moverCuadrado()
    setPuntos(prev => prev + 1)
  }

  const moverCuadrado = () => {
    setPosition({ x: Math.random(), y: Math.random() })
  }

  const fallar = (e) => {
    if (isPlaying && e.target === e.currentTarget) {
      setFallos(prev => prev + 1)
    }
  }

  // clamp() mantiene el centro del objetivo a media anchura del borde (más un
  // margen), sea cual sea el tamaño del tablero y el tamaño del propio objetivo.
  const margin = 'calc(var(--target-size) / 2 + 8px)'
  const style = {
    left: `clamp(${margin}, ${position.x * 100}%, calc(100% - ${margin}))`,
    top: `clamp(${margin}, ${position.y * 100}%, calc(100% - ${margin}))`,
  }

  const classNames = ['tablero', isPlaying ? 'active' : 'inactive']

  if (difficulty === 'precision') {
    classNames.push('precision')
  }

  return (
    <div className={classNames.join(' ')} onClick={fallar}>
      <div className="cuadrado" style={style} onClick={puntuar}></div>
    </div>
  )
}

export default Tablero
