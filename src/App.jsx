import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Game from './pages/Game/Game'
import Register from './pages/Register/Register'
import { clearAuthToken, getAuthToken, SESSION_EXPIRED_EVENT } from './services/auth'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAuthToken()))

  const handleLogout = () => {
    clearAuthToken()
    setIsAuthenticated(false)
  }

  useEffect(() => {
    const handleSessionExpired = () => setIsAuthenticated(false)
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)

    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [])

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
              ? <Game onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
