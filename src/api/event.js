import { API_BASE_URL } from '@/config/api'

function resolveCommunity(event, communitiesMap) {
  return event.community || communitiesMap[event.communityId] || communitiesMap[event.id_community] || null
}

function resolveAddress(event, addressesMap) {
  if (event.address) {
    return event.address
  }
  if (event.addressId) {
    return addressesMap[event.addressId]
  }
  if (event.id_address) {
    return addressesMap[event.id_address]
  }
  return null
}

function mapEventData(event, communitiesMap, addressesMap) {
  const modalityCode = event.modality?.code || event.modality
  const community = resolveCommunity(event, communitiesMap)
  const address = resolveAddress(event, addressesMap)

  return {
    ...event,
    start_date_time: event.startDateTime || event.start_date_time,
    end_date_time: event.endDateTime || event.end_date_time,
    modalidade: typeof modalityCode === 'string' ? modalityCode.toLowerCase() : '',
    modality: typeof modalityCode === 'string' ? modalityCode : event.modality,
    community,
    address
  }
}

async function handleApiError(response, defaultMessage = 'Erro na API') {
  const errorText = await response.text()
  console.error('Erro da API:', errorText)

  let errorMessage = defaultMessage
  try {
    const errorData = JSON.parse(errorText)
    if (errorData.message) {
      errorMessage = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message
    }
  } catch {
    errorMessage = `Erro ${response.status}: ${errorText}`
  }

  throw new Error(errorMessage)
}

export async function getEvents(filters = {}) {
  try {
    const queryParams = new URLSearchParams({
      take: 100,
      ...filters
    })

    const [communitiesRes, eventsRes, addressesRes] = await Promise.all([
      fetch(`${API_BASE_URL}/communities`, { credentials: 'include' }),
      fetch(`${API_BASE_URL}/events?${queryParams.toString()}`, { credentials: 'include' }),
      fetch(`${API_BASE_URL}/address`, { credentials: 'include' })
    ])

    if (!communitiesRes.ok || !eventsRes.ok || !addressesRes.ok) {
      throw new Error('Network response was not ok')
    }

    const communitiesData = await communitiesRes.json()
    const eventsData = await eventsRes.json()
    const addressesData = await addressesRes.json()

    // Extract data from paginated responses if necessary
    const communitiesList = communitiesData.data || communitiesData
    const eventsList = eventsData.data || eventsData
    const addressesList = addressesData.data || addressesData

    const communitiesMap = communitiesList.reduce((acc, community) => {
      acc[community.id] = community
      return acc
    }, {})

    const addressesMap = addressesList.reduce((acc, address) => {
      acc[address.id] = address
      return acc
    }, {})

    return eventsList.map((event) => mapEventData(event, communitiesMap, addressesMap))
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    throw error
  }
}

export async function createEvent(communityId, eventData) {
  try {
    const payload = {
      title: eventData.title,
      description: eventData.description,
      start_date_time: eventData.start_date_time,
      end_date_time: eventData.end_date_time,
      modality: eventData.modality,
      link: eventData.link || null,
      capa_url: eventData.capa_url || null,
      is_active: eventData.is_active ?? true,

      ...(eventData.modality !== 'ONLINE'
        && eventData.address && {
        address: {
          cep: eventData.address.cep,
          state: eventData.address.state,
          city: eventData.address.city,
          neighborhood: eventData.address.neighborhood,
          streetAddress: eventData.address.streetAddress,
          number: eventData.address.number
        }
      })
    }

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      await handleApiError(response, 'Erro ao criar evento')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    throw error
  }
}

export async function updateEvent(id, eventData) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(eventData)
    })

    if (!response.ok) {
      throw new Error('Erro ao atualizar evento')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao atualizar evento:', error)
    throw error
  }
}

export async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText)
    }

    return true
  } catch (error) {
    console.error('Erro ao excluir evento:', error)
    throw error
  }
}

export async function getEventById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar evento')
    }

    const event = await response.json()

    // Normalize data similar to getEvents
    return mapEventData(event, {}, {})
  } catch (error) {
    console.error('Erro ao buscar evento:', error)
    throw error
  }
}

export const updateEvento = updateEvent
export const createEvento = createEvent
