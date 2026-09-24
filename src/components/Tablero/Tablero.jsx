import { useState } from 'react'
import './Tablero.css'

const Tablero = ({setPuntos, setFallos}) => {
  const [position, setPosition] = useState({ x: 490, y: 240 })

  const puntuar = () => {
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
     if (e.target === e.currentTarget) {
      setFallos(prev => prev + 1)

    }
  }

  return (
    <div className="tablero" onClick={fallar}>
        <div className="cuadrado" style={{ position: 'absolute', left: position.x, top: position.y }} onClick={puntuar}></div>
    </div>
  )
}

export default Tablero
