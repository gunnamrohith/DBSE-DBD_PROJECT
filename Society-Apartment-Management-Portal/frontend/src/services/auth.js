const sessionKey = 'haven-demo-user'
const tokenKey = 'haven-token'
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function getDemoAccounts() {
  const response = await fetch(`${baseUrl}/auth/accounts`)
  const payload = await response.json().catch(() => [])
  if (!response.ok) throw new Error(payload.message || 'Unable to load society members.')
  return payload
}

export async function signIn(email, password) {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'Email or password is incorrect.')
  const { user, token } = payload
  localStorage.setItem(sessionKey, JSON.stringify(user))
  localStorage.setItem(tokenKey, token)
  return user
}

async function accountRequest(path, body) {
  const response = await fetch(`${baseUrl}/account/${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem(tokenKey)}` },
    body: JSON.stringify(body),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'Unable to save account settings.')
  return payload
}

export async function updateProfile(values) {
  const { user, token } = await accountRequest('profile', values)
  localStorage.setItem(sessionKey, JSON.stringify(user))
  localStorage.setItem(tokenKey, token)
  window.dispatchEvent(new Event('haven-session-change'))
  return user
}

export const changePassword = (values) => accountRequest('password', values)

export function signOut() {
  localStorage.removeItem(sessionKey)
  localStorage.removeItem(tokenKey)
  localStorage.removeItem('haven-demo-auth')
}

export function getCurrentUser() {
  try {
    if (!localStorage.getItem(tokenKey)) return null
    return JSON.parse(localStorage.getItem(sessionKey))
  } catch {
    return null
  }
}
