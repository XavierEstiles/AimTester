import { NavLink } from 'react-router-dom'
import './GameMenu.css'

const GameMenu = ({ onLogout }) => {
  return (
    <nav className="game-menu" aria-label="Menú principal">
      <div className="menu-branding">
        <img className="menu-logo" src="./src/assets/images/logo.png" alt="Logo de Aim Tester" />
        <NavLink className="menu-brand" to="/game">
          AIM TESTER
        </NavLink>
      </div>
      <div className="menu-links">
        <NavLink
          className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}
          to="/game"
        >
          Partida
        </NavLink>
        <NavLink
          className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}
          to="/estadisticas"
        >
          Estadísticas
        </NavLink>
        <button className="logout-button" type="button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}

export default GameMenu
