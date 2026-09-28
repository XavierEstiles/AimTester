import { useEffect, useState } from 'react'
import '../../App.css'
import GameMenu from '../../components/GameMenu/GameMenu'
import GameHeader from '../../components/GameHeader/GameHeader'
import Paginator from '../../components/Paginator/Paginator'
import { getMe } from '../../services/auth'
import { getMatches, getStats, getStatsByMode } from '../../services/matches'
import { modeLabel } from '../../services/modes'
import './Stats.css'

const HISTORY_LIMIT = 20
const CHART_LIMIT = 10

const formatNumber = (value, digits = 0) => {
  const number = Number(value)
  return Number.isNaN(number)
    ? '—'
    : number.toLocaleString('es-ES', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })
}

const parseDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatDate = (value) => {
  const date = parseDate(value)
  return date
    ? date.toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'
}

const formatShortDate = (value) => {
  const date = parseDate(value)
  return date
    ? date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
    : '—'
}

/**
 * Carga una página de partidas y expone su contenido junto al estado de la
 * petición. Se vuelve a pedir cuando cambia la página o cuando se pulsa
 * "Actualizar" (a través de `token`), y se descarta la respuesta si el usuario
 * ya había navegado a otra página.
 *
 * @param size  partidas por página
 * @param page  página actual, empezando en 0
 * @param token cambia para forzar una recarga
 */
const useMatchPage = (size, page, token) => {
  const requestKey = `${size}:${page}:${token}`
  const [result, setResult] = useState({ key: null, items: [], error: '' })

  useEffect(() => {
    let cancelled = false

    getMatches(size, page)
      .then((data) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            items: Array.isArray(data) ? data : [],
            error: '',
          })
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            items: [],
            error: requestError.message || 'No se pudieron cargar las partidas.',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [size, page, token, requestKey])

  // Mientras la respuesta no corresponda a la página pedida se considera que
  // sigue cargando: así el estado se deriva y no hace falta resetearlo a mano.
  const settled = result.key === requestKey

  return {
    items: settled ? result.items : [],
    pageError: settled ? result.error : '',
    pageLoading: !settled,
  }
}

/** Primera y última posición (1-based) que ocupa una página en el listado. */
const pageRange = (itemCount, page, size) => {
  const first = page * size + 1
  return { first, last: first + itemCount - 1 }
}

const Stats = ({ onLogout }) => {
  const [username, setUsername] = useState('')
  const [stats, setStats] = useState(null)
  const [modeStats, setModeStats] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [chartPage, setChartPage] = useState(0)
  const [historyPage, setHistoryPage] = useState(0)

  // Cada recarga cambia el "token": el effect vuelve a pedir los datos al API.
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false

    Promise.all([getStats(), getStatsByMode()])
      .then(([statsData, modeStatsData]) => {
        if (cancelled) return
        setStats(statsData)
        setModeStats(Array.isArray(modeStatsData) ? modeStatsData : [])
        setStatus('ready')
      })
      .catch((requestError) => {
        if (cancelled) return
        setError(requestError.message || 'No se pudieron cargar las estadísticas.')
        setStatus('error')
      })

    // El nombre del jugador es opcional: si falla, la página sigue siendo útil.
    getMe()
      .then((data) => {
        if (!cancelled) setUsername(data.username)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const chart = useMatchPage(CHART_LIMIT, chartPage, reloadToken)
  const history = useMatchPage(HISTORY_LIMIT, historyPage, reloadToken)

  // Vuelve al principio de ambos listados y dispara la recarga al instante.
  const reload = () => {
    setStatus('loading')
    setError('')
    setChartPage(0)
    setHistoryPage(0)
    setReloadToken((token) => token + 1)
  }

  const hasMatches = stats !== null && stats.matchesPlayed > 0
  const totalMatches = stats === null ? 0 : stats.matchesPlayed
  const chartTotalPages = Math.max(1, Math.ceil(totalMatches / CHART_LIMIT))
  const historyTotalPages = Math.max(1, Math.ceil(totalMatches / HISTORY_LIMIT))

  // El historial llega del más reciente al más antiguo: se invierte para el gráfico.
  const chartMatches = [...chart.items].reverse()
  const maxScore = chartMatches.reduce(
    (max, match) => Math.max(max, Number(match.hits) || 0),
    1
  )

  const chartRange = pageRange(chart.items.length, chartPage, CHART_LIMIT)
  const historyRange = pageRange(history.items.length, historyPage, HISTORY_LIMIT)

  const chartTitle = chart.pageLoading
    ? 'Puntuación de las partidas'
    : chartPage === 0
      ? `Puntuación de las últimas ${chartMatches.length} partidas`
      : `Puntuación de las partidas ${chartRange.first}–${chartRange.last}`

  return (
    <main className="app stats-page">
      <GameMenu onLogout={onLogout} />
      <GameHeader title="Estadísticas" />

      <header className="stats-heading">
        <span className="stats-eyebrow">PERFIL / RENDIMIENTO</span>
        <h2>Estadísticas{username ? ` de ${username}` : ''}</h2>
        <p>Resumen de todas las partidas que has jugado en Aim Tester.</p>
        <button
          className="stats-refresh"
          type="button"
          onClick={reload}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Actualizando…' : 'Actualizar'}
        </button>
      </header>

      {status === 'loading' && <p className="stats-feedback">Cargando estadísticas…</p>}

      {status === 'error' && (
        <div className="stats-feedback stats-feedback--error" role="alert">
          <p>{error}</p>
          <button className="stats-refresh" type="button" onClick={reload}>
            Reintentar
          </button>
        </div>
      )}

      {status === 'ready' && stats !== null && (
        <>
          <ul className="stats-grid">
            <li className="stat-card">
              <span className="stat-label">Partidas jugadas</span>
              <span className="stat-value">{formatNumber(stats.matchesPlayed)}</span>
            </li>
            <li className="stat-card stat-card--highlight">
              <span className="stat-label">Mejor puntuación</span>
              <span className="stat-value">{formatNumber(stats.bestScore)}</span>
            </li>
            <li className="stat-card">
              <span className="stat-label">Puntuación media</span>
              <span className="stat-value">{formatNumber(stats.avgScore, 1)}</span>
            </li>
            <li className="stat-card stat-card--highlight">
              <span className="stat-label">Precisión global</span>
              <span className="stat-value">{formatNumber(stats.accuracy, 1)}%</span>
            </li>
            <li className="stat-card">
              <span className="stat-label">Aciertos totales</span>
              <span className="stat-value">{formatNumber(stats.totalHits)}</span>
            </li>
            <li className="stat-card">
              <span className="stat-label">Fallos totales</span>
              <span className="stat-value">{formatNumber(stats.totalMisses)}</span>
            </li>
            <li className="stat-card">
              <span className="stat-label">Última partida</span>
              <span className="stat-value stat-value--date">
                {formatDate(stats.lastMatchAt)}
              </span>
            </li>
          </ul>

          {modeStats.length > 0 && (
            <section className="stats-panel" aria-labelledby="modes-title">
              <h3 id="modes-title">Récords por modo</h3>
              <ul className="mode-records">
                {modeStats.map((entry) => (
                  <li className="mode-record" key={entry.mode}>
                    <span className="mode-record-mode">{modeLabel(entry.mode)}</span>
                    <span className="mode-record-best">
                      <small>Mejor</small>
                      {formatNumber(entry.bestScore)}
                    </span>
                    <span className="mode-record-meta">
                      {formatNumber(entry.matchesPlayed)} partidas · precisión{' '}
                      {formatNumber(entry.accuracy, 1)}% · media{' '}
                      {formatNumber(entry.avgScore, 1)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!hasMatches ? (
            <p className="stats-feedback">
              Todavía no has jugado ninguna partida. Completa una prueba y vuelve aquí
              para ver tu progreso.
            </p>
          ) : (
            <>
              <section className="stats-panel" aria-labelledby="chart-title">
                <div className="stats-panel-heading">
                  <h3 id="chart-title">{chartTitle}</h3>
                  <Paginator
                    page={chartPage}
                    totalPages={chartTotalPages}
                    onChange={setChartPage}
                    disabled={chart.pageLoading}
                    label="Paginación del gráfico de puntuaciones"
                  />
                </div>

                {chart.pageLoading && <p className="stats-feedback">Cargando partidas…</p>}

                {!chart.pageLoading && chart.pageError && (
                  <p className="stats-feedback stats-feedback--error" role="alert">
                    {chart.pageError}
                  </p>
                )}

                {!chart.pageLoading && !chart.pageError && (
                  chartMatches.length === 0 ? (
                    <p className="stats-feedback">No hay partidas en esta página.</p>
                  ) : (
                    <div
                      className="stats-chart"
                      role="img"
                      aria-label={`Gráfico de barras con la puntuación de las partidas ${chartRange.first} a ${chartRange.last}`}
                    >
                      {chartMatches.map((match) => {
                        const score = Number(match.hits) || 0
                        const height = Math.max((score / maxScore) * 100, 4)

                        return (
                          <div className="chart-column" key={match.id ?? `${match.startedAt}-${score}`}>
                            <div className="chart-track">
                              <div className="chart-bar" style={{ height: `${height}%` }} />
                            </div>
                            <span className="chart-value">{score}</span>
                            <span className="chart-date">{formatShortDate(match.startedAt)}</span>
                          </div>
                        )
                      })}
                    </div>
                  )
                )}

                {!chart.pageLoading && chartRange.last >= chartRange.first && chartTotalPages > 1 && (
                  <p className="stats-note">
                    Mostrando las partidas {chartRange.first}–{chartRange.last} de{' '}
                    {formatNumber(totalMatches)}.
                  </p>
                )}
              </section>

              <section className="stats-panel" aria-labelledby="history-title">
                <div className="stats-panel-heading">
                  <h3 id="history-title">Historial de partidas</h3>
                  <Paginator
                    page={historyPage}
                    totalPages={historyTotalPages}
                    onChange={setHistoryPage}
                    disabled={history.pageLoading}
                    label="Paginación del historial de partidas"
                  />
                </div>

                {history.pageLoading && <p className="stats-feedback">Cargando partidas…</p>}

                {!history.pageLoading && history.pageError && (
                  <p className="stats-feedback stats-feedback--error" role="alert">
                    {history.pageError}
                  </p>
                )}

                {!history.pageLoading && !history.pageError && (
                  history.items.length === 0 ? (
                    <p className="stats-feedback">No hay partidas en esta página.</p>
                  ) : (
                    <div className="stats-table-wrap">
                      <table className="stats-table">
                        <thead>
                          <tr>
                            <th scope="col">Fecha</th>
                            <th scope="col">Modo</th>
                            <th scope="col">Puntos</th>
                            <th scope="col">Fallos</th>
                            <th scope="col">Precisión</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.items.map((match) => (
                            <tr key={match.id ?? `${match.startedAt}-${match.hits}`}>
                              <td>{formatDate(match.startedAt)}</td>
                              <td>{modeLabel(match.mode)}</td>
                              <td className="cell-score">{formatNumber(match.hits)}</td>
                              <td>{formatNumber(match.misses)}</td>
                              <td>{formatNumber(match.accuracy, 1)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}

                {!history.pageLoading && historyRange.last >= historyRange.first && historyTotalPages > 1 && (
                  <p className="stats-note">
                    Mostrando las partidas {historyRange.first}–{historyRange.last} de{' '}
                    {formatNumber(totalMatches)}.
                  </p>
                )}
              </section>
            </>
          )}
        </>
      )}
    </main>
  )
}

export default Stats
