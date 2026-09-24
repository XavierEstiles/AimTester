import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'

const Register = ({ onRegister }) => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.')
      return
    }

    onRegister()
    navigate('/game')
  }

  return (
    <main className="register-page">
      <section className="register-card" aria-labelledby="register-title">
        <div className="login-heading">
          <span className="login-eyebrow">AIM TESTER / NEW PLAYER</span>
          <h1 id="register-title">Crear cuenta</h1>
          <p>Configura tu perfil y empieza a mejorar tu puntería.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Nombre de jugador</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="AimMaster"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="register-email">Correo electrónico</label>
          <input
            id="register-email"
            name="email"
            type="email"
            placeholder="jugador@ejemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="register-password">Contraseña</label>
          <input
            id="register-password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <label htmlFor="confirm-password">Confirmar contraseña</label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <button className="login-submit" type="submit">
            Crear cuenta
          </button>
          {message && <p className="login-message" role="alert">{message}</p>}
        </form>

        <p className="login-register">
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  )
}

export default Register
