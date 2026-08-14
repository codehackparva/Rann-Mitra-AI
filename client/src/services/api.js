const API_BASE = '/api'

async function handleResponse(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Request failed with status ${res.status}`)
  }
  return res.json()
}

export async function sendMessage(message, conversationHistory = []) {
  let res
  try {
    res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory }),
    })
  } catch {
    throw new Error(
      'Cannot reach the backend server. Make sure the server is running on port 5000.\n\n' +
      'Run this in a terminal:\n  cd rann-mitra-ai/server\n  npm run dev'
    )
  }
  return handleResponse(res)
}

export async function fetchDashboard() {
  let res
  try {
    res = await fetch(`${API_BASE}/dashboard`)
  } catch {
    throw new Error('Cannot reach the backend server.')
  }
  return handleResponse(res)
}

export async function fetchDestinations() {
  let res
  try {
    res = await fetch(`${API_BASE}/destinations`)
  } catch {
    throw new Error('Cannot reach the backend server.')
  }
  return handleResponse(res)
}

export async function fetchHealth() {
  let res
  try {
    res = await fetch(`${API_BASE}/health`)
  } catch {
    throw new Error('Cannot reach the backend server.')
  }
  return handleResponse(res)
}
