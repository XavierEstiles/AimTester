import { DIFFICULTIES, DURATIONS, buildModeId, findDifficulty, findMode } from '../../services/modes'
import './GameModal.css'

const SAVE_MESSAGES = {
  saving: 'Guardando partida…',
  saved: 'Partida guardada ✓',
  error: 'No se pudo guardar la partida.',
}

const GameModal = ({
  timeLeft,
  puntos,
  fallos,
  saveState,
  mode,
  onSelectMode,
  isPlaying,
  onStart,
}) => {
  const hasFinished = timeLeft === 0

  const selectDuration = (durationSeconds) =>
    onSelectMode(findMode(buildModeId(mode.difficulty, durationSeconds)))

  const selectDifficulty = (difficultyId) =>
    onSelectMode(findMode(buildModeId(difficultyId, mode.durationSeconds)))

  const activeDifficulty = findDifficulty(mode.difficulty)

  return (
    <div className="game-modal-backdrop" role="presentation">
      <section className="game-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">{hasFinished ? 'Prueba terminada' : '¿Listo para apuntar?'}</h2>
        {hasFinished ? (
          <p>
            Has conseguido {puntos} puntos con {fallos} fallos en modo {mode.label}.
          </p>
        ) : (
          <p>
            Tienes {mode.durationSeconds} segundos para pulsar tantos objetivos como
            puedas antes de que se acabe el tiempo.
          </p>
        )}
        {hasFinished && saveState && (
          <p className={`game-modal-save ${saveState === 'error' ? 'error' : ''}`}>
            {SAVE_MESSAGES[saveState]}
          </p>
        )}

        <div className="mode-picker" role="group" aria-label="Modo de juego">
          <div className="mode-row">
            <span className="mode-row-label">Duración</span>
            <div className="mode-chips">
              {DURATIONS.map((durationSeconds) => {
                const selected = mode.durationSeconds === durationSeconds

                return (
                  <button
                    key={durationSeconds}
                    type="button"
                    className={`mode-chip ${selected ? 'selected' : ''}`}
                    aria-pressed={selected}
                    disabled={isPlaying}
                    onClick={() => selectDuration(durationSeconds)}
                  >
                    {durationSeconds} s
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mode-row">
            <span className="mode-row-label">Objetivo</span>
            <div className="mode-chips">
              {DIFFICULTIES.map((difficulty) => {
                const selected = mode.difficulty === difficulty.id

                return (
                  <button
                    key={difficulty.id}
                    type="button"
                    className={`mode-chip ${selected ? 'selected' : ''}`}
                    title={difficulty.description}
                    aria-pressed={selected}
                    disabled={isPlaying}
                    onClick={() => selectDifficulty(difficulty.id)}
                  >
                    {difficulty.label}
                  </button>
                )
              })}
            </div>
          </div>

          <p className="mode-hint">
            <strong>{activeDifficulty.label}</strong> · {activeDifficulty.description}{' '}
          </p>
        </div>

        <button className="start-button modal-start" type="button" onClick={onStart}>
          {hasFinished ? 'Repetir prueba' : 'Comenzar ahora'}
        </button>
      </section>
    </div>
  )
}

export default GameModal
