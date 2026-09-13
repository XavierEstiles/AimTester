import { useState } from 'react'
import './App.css'

function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  function moverCuadrado() {
    setPosition({
      x:  Math.random() * 990,
      y: Math.random() * 490
    })
  }


  return (
    <div className="app">
      <h1>Atrapa el cuadrado</h1>
      <div className="tablero">
        <div className="cuadrado" style={{ position: 'absolute', left: position.x, top: position.y }} onClick={moverCuadrado}></div>
      </div>
    </div>
  )
}



export default App
