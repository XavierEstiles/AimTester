import { useState } from 'react'
import './Tablero.css'

function Tablero({setPuntos, setFallos}) {
  const [position, setPosition] = useState({ x: 490, y: 240 })

  function puntuar(e){
    moverCuadrado();
    setPuntos(prev => prev + 1)
  }

  function moverCuadrado() {
    setPosition({
      x:  Math.random() * 950,
      y: Math.random() * 450
    })
  }

  function fallar(e){
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
