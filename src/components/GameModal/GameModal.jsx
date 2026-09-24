import './GameModal.css'

const GameModal = ({ timeLeft, puntos, fallos, onStart }) => {
  const hasFinished = timeLeft === 0

  return (
    <div className="game-modal-backdrop" role="presentation">
      <section className="game-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <span className="modal-eyebrow">AIM TESTER / 30 SECOND CHALLENGE</span>
        <h2 id="modal-title">{hasFinished ? 'Prueba terminada' : '¿Listo para apuntar?'}</h2>
        {hasFinished ? (
          <p>Has conseguido {puntos} puntos con {fallos} fallos.</p>
        ) : (
          <p>Pulsa tantos objetivos como puedas antes de que se acabe el tiempo.</p>
        )}
        <button className="start-button modal-start" type="button" onClick={onStart}>
          {hasFinished ? 'Repetir prueba' : 'Comenzar ahora'}
        </button>
      </section>
    </div>
  )
}

export default GameModal
