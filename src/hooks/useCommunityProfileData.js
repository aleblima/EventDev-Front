import { useEffect, useState } from 'react'

import { getCommunityById } from '@/api/community'
import { getEvents } from '@/api/event'

export function useCommunityProfileData(communityId) {
  const [comunidade, setComunidade] = useState(null)
  const [eventosDaComunidade, setEventosDaComunidade] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const comunidadeData = await getCommunityById(communityId)
        setComunidade(comunidadeData)

        const eventos = await getEvents({ communityId: comunidadeData.id })
        setEventosDaComunidade(eventos)
      } catch (err) {
        console.error('Erro ao buscar comunidade e eventos:', err)
        setError('Erro ao carregar comunidade e eventos.')
      } finally {
        setLoading(false)
      }
    }

    if (communityId) {
      fetchData()
    }
  }, [communityId])

  return { comunidade, eventosDaComunidade, loading, error, setEventosDaComunidade }
}
