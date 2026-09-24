import { useState } from 'react'
import './Tablero.css'

const Tablero = ({ isPlaying, setPuntos, setFallos }) => {
  const [position, setPosition] = useState({ x: 490, y: 240 })

  const puntuar = () => {
    if (!isPlaying) {
      return
    }

    moverCuadrado();
    setPuntos(prev => prev + 1)
  }

  const moverCuadrado = () => {
    setPosition({
      x:  Math.random() * 950,
      y: Math.random() * 450
    })
  }

  const fallar = (e) => {
      if (isPlaying && e.target === e.currentTarget) {
      setFallos(prev => prev + 1)

    }
  }

  return (
    <div className={`tablero ${isPlaying ? 'active' : 'inactive'}`} onClick={fallar}>
        <div className="cuadrado" style={{ position: 'absolute', left: position.x, top: position.y }} onClick={puntuar}></div>
    </div>
  )
}

export default Tablero
