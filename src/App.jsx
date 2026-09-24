import { useState } from 'react'
import './App.css'
import Tablero from './components/Tablero/Tablero'
import Informacion from './components/Informacion/Informacion'

const App = () => {
  const [puntos, setPuntos] = useState(0)
  const [fallos, setFallos] = useState(0) 

  
  return (
    <div className="app">
      <h1>Aim Tester</h1>
      <Informacion puntos={puntos} fallos={fallos}/>
      <Tablero setPuntos={setPuntos} setFallos={setFallos}/>
    </div>
  )
}

export default App
