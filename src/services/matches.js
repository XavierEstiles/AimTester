import { apiRequest } from './auth'

const readMessage = async (response, fallback) => {
  try {
    const data = await response.json()
    return data.message || fallback
  } catch {
    return fallback
  }
}

const send = async (path, options) => {
  const response = await apiRequest(path, options)

  if (!response.ok) {
    throw new Error(await readMessage(response, 'La petición no se pudo completar.'))
  }

  return response.json()
}

/** Guarda una partida terminada en el API. */
export const saveMatch = (match) =>
  send('/matches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(match),
  })

/** Historial de partidas del jugador autenticado. */
export const getMatches = (limit = 20) => send(`/matches?limit=${limit}`)

/** Estadísticas agregadas del jugador autenticado. */
export const getStats = () => send('/player/stats')

/** Clasificación general. */
export const getLeaderboard = (limit = 20) => send(`/leaderboard?limit=${limit}`)
