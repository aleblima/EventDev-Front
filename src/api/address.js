import { API_BASE_URL } from '@/config/api'

export async function getEnderecos() {
  try {
    const response = await fetch(`${API_BASE_URL}/address`, { credentials: 'include' })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar endereços:', error)
    throw error
  }
}

export async function getEnderecoById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/address/${id}`)
    if (!response.ok) {
      throw new Error('Erro ao buscar endereço')
    }
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar endereço:', error)
    throw error
  }
}

export async function createEndereco(dadosEndereco) {
  try {
    const payload = {
      ...dadosEndereco
    }

    const response = await fetch(`${API_BASE_URL}/address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro da API (endereço):', errorText)
      throw new Error(`Erro ${response.status}: ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao criar endereço:', error)
    throw error
  }
}

export async function updateEndereco(id, dadosEndereco) {
  try {
    const payload = {
      ...dadosEndereco,
      atualizado_em: new Date().toISOString()
    }

    const response = await fetch(`${API_BASE_URL}/address/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('Erro ao atualizar endereço')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error)
    throw error
  }
}

export async function deleteEndereco(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/address/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Erro ao excluir endereço')
    }

    return true
  } catch (error) {
    console.error('Erro ao excluir endereço:', error)
    throw error
  }
}

export async function getEnderecoByCep(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json`)
    if (!response.ok) {
      throw new Error('Erro ao buscar CEP')
    }
    const data = await response.json()
    if (data.erro) {
      throw new Error('CEP não encontrado')
    }
    return {
      rua: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || ''
    }
  } catch (error) {
    console.error('Erro ao buscar endereço pelo CEP:', error)
    throw error
  }
}
