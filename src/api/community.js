import { API_BASE_URL } from '@/config/api'

function generateSlug(name) {
  if (!name) {
    return ''
  }
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export async function getCommunities() {
  const response = await fetch(`${API_BASE_URL}/communities`, {
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  const data = await response.json()
  return data.data || data
}

export async function getUserCommunity() {
  try {
    const response = await fetch(`${API_BASE_URL}/communities/me`, {
      credentials: 'include' // Inclui cookies de sessão
    })

    if (!response.ok) {
      return null
    }

    // Verificar se há conteúdo antes de tentar fazer parse JSON
    const text = await response.text()
    if (!text.trim()) {
      return null
    }

    return JSON.parse(text)
  } catch (error) {
    console.error('Erro ao buscar comunidade do usuário:', error)
    return null
  }
}

export async function getCommunityById(id) {
  const response = await fetch(`${API_BASE_URL}/communities/${id}`, {
    credentials: 'include'
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export async function getCommunityBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}/community`, {
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const allCommunities = await response.json()

    let community = allCommunities.find((c) => c.slug === slug)
    if (community) {
      return community
    }

    community = allCommunities.find((c) => generateSlug(c.name) === slug)
    if (community) {
      return community
    }

    if (!Number.isNaN(Number(slug))) {
      community = allCommunities.find((c) => c.id === slug || c.id === Number.parseInt(slug))
      if (community) {
        return community
      }
    }

    const normalizedSlug = slug.replace(/-/g, ' ').toLowerCase()
    community = allCommunities.find((c) => c.name && c.name.toLowerCase().includes(normalizedSlug))

    return community || null
  } catch (error) {
    throw new Error(`Erro ao buscar comunidade: ${error.message}`)
  }
}

function createPayload(communityData) {
  const logoUrl = typeof communityData.logo_url === 'string' ? communityData.logo_url : communityData.logo_url?.url || ''

  const payload = {
    name: communityData.nome,
    description: communityData.descricao || '',
    phone_number: communityData.telefone || '',
    link_website: communityData.link_website || '',
    link_instagram: communityData.link_instagram || '',
    link_linkedin: communityData.link_linkedin || '',
    link_github: communityData.link_github || '',
    logo_url: logoUrl,
    is_active: true
  }

  // Remove campos vazios ou inválidos
  Object.keys(payload).forEach((key) => {
    if (payload[key] === '' || payload[key] === null || payload[key] === undefined) {
      delete payload[key]
    }
  })

  return payload
}

export async function createCommunity(communityData, authToken) {
  const payload = createPayload(communityData)

  const headers = { 'Content-Type': 'application/json' }
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  const response = await fetch(`${API_BASE_URL}/communities`, {
    method: 'POST',
    headers,
    credentials: 'include', // Para incluir cookies de sessão do SuperTokens
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Erro da API:', errorText)
    throw new Error(`Erro ${response.status}: ${errorText}`)
  }

  return response.json()
}

export async function updateCommunity(id, communityData) {
  const response = await fetch(`${API_BASE_URL}/communities/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(communityData)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erro ${response.status}: ${errorText}`)
  }

  return response.json()
}

export async function deleteCommunity(id) {
  const response = await fetch(`${API_BASE_URL}/communities/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Erro ao excluir comunidade')
  }
  return true
}
