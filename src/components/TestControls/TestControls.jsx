import './TestControls.css'
import { findDifficulty } from '../../services/modes'

const TestControls = ({ timeLeft, total, mode, isPlaying }) => {
  const status = isPlaying ? 'EN CURSO' : timeLeft === 0 ? 'TIEMPO AGOTADO' : 'LISTO'
  /* El total solo se muestra mientras cuenta: evita repetir "30s / 30s". */
  const showTotal = timeLeft !== total
  /* Solo la dificultad: la duración ya la indica el temporizador. */
  const modeName = findDifficulty(mode.difficulty).label

  return (
    <div className="test-controls">
      <div className={`test-timer ${isPlaying ? 'playing' : ''}`}>
        <span className="test-label">Tiempo</span>
        <strong>{timeLeft}s</strong>
        {showTotal && <span className="test-total">/ {total}s</span>}
      </div>
      <span className="test-mode">{modeName}</span>
      <span className="test-status">{status}</span>
    </div>
  )
}

export default TestControls
