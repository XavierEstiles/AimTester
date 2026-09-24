import './TestControls.css'

const TestControls = ({ timeLeft, isPlaying, onStart }) => {
  const status = isPlaying ? 'EN CURSO' : timeLeft === 0 ? 'TIEMPO AGOTADO' : 'LISTO'

  return (
    <div className="test-controls">
      <div className={`test-timer ${isPlaying ? 'playing' : ''}`}>
        <span>Tiempo</span>
        <strong>{timeLeft}s</strong>
      </div>
      <span className="test-status">{status}</span>
    </div>
  )
}

export default TestControls
