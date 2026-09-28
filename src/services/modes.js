/**
 * Catálogo de modos de juego.
 *
 * El `id` es exactamente el valor que se envía al API en `POST /matches` y el
 * que se agrupa en `GET /player/stats/by-mode`: `<dificultad>_<segundos>s`.
 *
 * `description` es el texto que explica cada dificultad dentro del selector del
 * modal de partida.
 */

export const DURATIONS = [15, 30, 60]

export const DIFFICULTIES = [
  {
    id: 'classic',
    label: 'Normal',
    description: 'Modo de juego estándar con objetivos de tamaño normal.',
  },
  {
    id: 'precision',
    label: 'Precisión',
    description:'Modo de juego más exigente con objetivos más pequeños.',
  },
]

export const DEFAULT_MODE_ID = 'classic_30s'

/** Identificador de modo para una dificultad y una duración dadas. */
export const buildModeId = (difficulty, durationSeconds) => `${difficulty}_${durationSeconds}s`

export const GAME_MODES = DURATIONS.flatMap((durationSeconds) =>
  DIFFICULTIES.map((difficulty) => ({
    id: buildModeId(difficulty.id, durationSeconds),
    difficulty: difficulty.id,
    durationSeconds,
    label: `${difficulty.label} ${durationSeconds} s`,
  }))
)

export const DEFAULT_MODE =
  GAME_MODES.find((mode) => mode.id === DEFAULT_MODE_ID) || GAME_MODES[0]

/** Modo con ese id; los modos desconocidos (datos antiguos) caen al por defecto. */
export const findMode = (id) => GAME_MODES.find((mode) => mode.id === id) || DEFAULT_MODE

/** Dificultad con ese id (para mostrar su descripción en la interfaz). */
export const findDifficulty = (id) =>
  DIFFICULTIES.find((difficulty) => difficulty.id === id) || DIFFICULTIES[0]

/** Etiqueta legible de un modo para la interfaz. */
export const modeLabel = (id) => {
  const known = GAME_MODES.find((mode) => mode.id === id)
  return known ? known.label : id || 'Sin modo'
}
