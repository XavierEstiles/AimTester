import { useState } from 'react'
import './App.css'

function App() {
  const [position, setPosition] = useState({ x: 490, y: 240 })
  const [puntos, setPuntos] = useState({x:0})
  const [fallos, setFallos] = useState({x:0})

  

  function puntuar(e){
    moverCuadrado();
    setPuntos({x: puntos.x+1});
  }

  function moverCuadrado() {
    setPosition({
      x:  Math.random() * 950,
      y: Math.random() * 450
    })
  }

  function fallar(e){
     if (e.target === e.currentTarget) {
      setFallos({x: fallos.x+1})
    }
  }

  function calcularAciertos(){
    return puntos.x+fallos.x>0?(puntos.x/(puntos.x+fallos.x)*100).toFixed(0):0
  }

  return (
    <div className="app">
      <h1>Aim Tester</h1>
      <div className="informacion">
        <p>Puntos: {puntos.x}</p>
        <p>Fallos: {fallos.x}</p>
        <p>Acierto: {calcularAciertos()}%</p>
      </div>
      <div className="tablero" onClick={fallar}>
        <div className="cuadrado" style={{ position: 'absolute', left: position.x, top: position.y }} onClick={puntuar}></div>
      </div>
    </div>
  )
}

export default App
