import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Game from './pages/Game/Game'
import Register from './pages/Register/Register'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/game" replace />
              : <Login onLogin={() => setIsAuthenticated(true)} />
          }
        />
        <Route
          path="/registro"
          element={
            isAuthenticated
              ? <Navigate to="/game" replace />
              : <Register onRegister={() => setIsAuthenticated(true)} />
          }
        />
        <Route
          path="/game"
          element={
            isAuthenticated
              ? <Game onLogout={() => setIsAuthenticated(false)} />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
