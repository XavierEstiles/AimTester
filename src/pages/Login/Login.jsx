import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

const Login = ({ onLogin }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email || !password) {
      setMessage('Completa todos los campos para continuar.')
      return
    }

    onLogin()
    navigate('/game')
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
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jugador@ejemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
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

          <button className="login-submit" type="submit">
            Entrar al campo
          </button>
          {message && <p className="login-message" role="status">{message}</p>}
        </form>

        <p className="login-register">
          ¿Todavía no tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      </section>
    </main>
  )
}

export default Login