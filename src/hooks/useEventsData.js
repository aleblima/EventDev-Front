import { useEffect, useState } from 'react'

import { getEvents } from '@/api/event'

export function useEventsData(eventosProp, selectedDate) {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let eventosData

        if (eventosProp !== undefined && eventosProp !== null) {
          eventosData = eventosProp
        } else {
          eventosData = await getEvents()
        }

        if (selectedDate) {
          // Filtra eventos do dia selecionado
          const eventosDoDia = eventosData.filter((ev) => {
            const dateStr = ev.start_date_time || ev.data_hora_inicial
            if (!dateStr) {
              return false
            }
            return new Date(dateStr).toISOString().slice(0, 10) === new Date(selectedDate).toISOString().slice(0, 10)
          })
          setEventos(eventosDoDia)
        } else {
          setEventos(eventosData)
        }
      } catch (error) {
        console.error('Erro ao buscar eventos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [eventosProp, selectedDate])

  return { eventos, loading }
}
