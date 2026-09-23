import { useState } from 'react'
import './App.css'
import Tablero from './components/Tablero/Tablero'

function App() {
  const [puntos, setPuntos] = useState(0)
  const [fallos, setFallos] = useState(0) 

  function calcularAciertos(){
    return puntos+fallos>0?(puntos/(puntos+fallos)*100).toFixed(0):0
  }

  return (
    <div className="app">
      <h1>Aim Tester</h1>
      <div className="informacion">
        <p>Puntos: {puntos}</p>
        <p>Fallos: {fallos}</p>
        <p>Acierto: {calcularAciertos()}%</p>
      </div>
      <Tablero setPuntos={setPuntos} setFallos={setFallos}/>
    </div>
  )
}

export default App
