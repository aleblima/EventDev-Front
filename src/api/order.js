import { API_BASE_URL } from '@/config/api'

export async function createOrder(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Erro ao criar pedido')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    throw error
  }
}
