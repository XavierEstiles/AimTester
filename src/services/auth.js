const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.50.50:8080/aim-tester-api'
const TOKEN_KEY = 'aimTesterToken'
export const SESSION_EXPIRED_EVENT = 'aimtester:session-expired'
let expirationTimer

const getTokenExpiry = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const paddedPayload = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')
    return JSON.parse(atob(paddedPayload)).exp * 1000
  } catch {
    return 0
  }
}

const scheduleExpiration = (token) => {
  window.clearTimeout(expirationTimer)
  const delay = getTokenExpiry(token) - Date.now()

  if (delay <= 0) {
    clearAuthToken()
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
    return
  }

  expirationTimer = window.setTimeout(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    expirationTimer = undefined
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
  }, delay)
}

const storeAuthToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token)
  scheduleExpiration(token)
}

export const getAuthToken = () => {
  const token = sessionStorage.getItem(TOKEN_KEY)
  if (token && getTokenExpiry(token) > Date.now()) {
    scheduleExpiration(token)
    return token
  }

  if (token) clearAuthToken()
  return null
}

export const clearAuthToken = () => {
  window.clearTimeout(expirationTimer)
  expirationTimer = undefined
  sessionStorage.removeItem(TOKEN_KEY)
}

export const apiRequest = async (path, options = {}) => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('La sesión ha caducado. Inicia sesión de nuevo.')
  }

  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  const renewedToken = response.headers.get('X-Auth-Token')

  if (renewedToken) {
    storeAuthToken(renewedToken)
  } else if (response.status === 401 || response.status === 403) {
    clearAuthToken()
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
  }

  return response
}

export const login = async (username, password) => {
  let response

  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Comprueba que la API esté iniciada.')
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error('El usuario o la contraseña no son correctos.')
  }

  if (!response.ok) {
    throw new Error('No se pudo iniciar sesión. Inténtalo de nuevo.')
  }

  const data = await response.json()
  if (!data.token) {
    throw new Error('La respuesta de la API no contiene un token de acceso.')
  }

  storeAuthToken(data.token)
  return data.token
}

/** Devuelve el usuario autenticado (JWT). */
export const getMe = async () => {
  const response = await apiRequest('/player/me')

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'No se pudo obtener el usuario autenticado.'))
  }

  return response.json()
}

const readErrorMessage = async (response, fallback) => {
  try {
    const data = await response.json()
    return data.message || fallback
  } catch {
    return fallback
  }
}

export const register = async (username, email, password) => {
  let response

  try {
    response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Comprueba que la API esté iniciada.')
  }

  if (response.status === 409) {
    throw new Error(await readErrorMessage(response, 'Ese nombre de usuario o correo ya está registrado.'))
  }

  if (response.status === 400) {
    throw new Error(await readErrorMessage(response, 'Revisa los datos del formulario.'))
  }

  if (!response.ok) {
    throw new Error('No se pudo crear la cuenta. Inténtalo de nuevo.')
  }

  const data = await response.json()
  if (!data.token) {
    throw new Error('La respuesta de la API no contiene un token de acceso.')
  }

  storeAuthToken(data.token)
  return data.token
}