import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authenticate } from '../../services/auth'
import './Login.css'

const Login = ({ onLogin }) => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setIsSubmitting(true)

    try {
      await authenticate(username, password)
      onLogin()
      navigate('/game')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-heading">
          <span className="login-eyebrow">AIM TESTER / ACCESS</span>
          <h1 id="login-title">Bienvenido</h1>
          <p>Inicia sesión para guardar y revisar tu progreso.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Nombre de usuario</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="admin"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <div className="login-options">
            <label className="remember-option">
              <input type="checkbox" name="remember" />
              <span>Recordarme</span>
            </label>
            <button className="forgot-password" type="button">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button className="login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Conectando...' : 'Entrar al campo'}
          </button>
          {message && <p className="login-message" role="alert">{message}</p>}
        </form>

        <p className="login-register">
          ¿Todavía no tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      </section>
    </main>
  )
}

export default Login