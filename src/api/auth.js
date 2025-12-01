import { API_BASE_URL } from '@/config/api'

export async function signIn(credentials) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Erro ao fazer login')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    throw error
  }
}

export async function signUpCommunity(communityData) {
  try {
    const payload = {
      ...communityData,
      role: 'community',
      is_active: true
    }

    console.warn('Payload antes da limpeza:', payload)

    // Remove logo_url se estiver vazio, inválido ou não for uma URL válida
    if (
      !payload.logo_url
      || typeof payload.logo_url !== 'string'
      || payload.logo_url.trim() === ''
      || (!payload.logo_url.startsWith('http://') && !payload.logo_url.startsWith('https://'))
    ) {
      delete payload.logo_url
      console.warn('logo_url removido do payload')
    }

    console.warn('Payload final:', payload)

    const response = await fetch(`${API_BASE_URL}/auth/signup/community`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.warn('Erro da API:', errorData)
      throw new Error(errorData.message || 'Erro ao cadastrar comunidade')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao cadastrar comunidade:', error)
    throw error
  }
}

export async function signUp(userData) {
  try {
    const payload = {
      ...userData,
      role: 'user',
      is_active: true
    }

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Erro ao cadastrar usuário')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error)
    throw error
  }
}
