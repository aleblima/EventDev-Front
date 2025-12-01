import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'

import DynamicCalendar from '@/shared/components/DynamicCalendar'
import SelectedDatePanel from '@/shared/components/SelectDatePanel'

import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

const EMPTY_ARRAY = []

// Função utilitária para comparar modalidade
function modalityMatch(event, type) {
  if (type === 'todos') {
    return true
  }
  const eventModality = event.modality?.toLowerCase()
  const filterType = type?.toLowerCase()
  return eventModality === filterType
}

function CalendarViewContent({ initialDate, eventos, eventType, minDate, maxDate }) {
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [viewedDate, setViewedDate] = useState(initialDate)

  // Atualiza os dias destacados ao mudar mês/ano ou filtro
  const highlightedDays = useMemo(() => {
    const diasComEvento = eventos
      .filter(
        (evento) =>
          dayjs(evento.start_date_time).month() === dayjs(viewedDate).month()
          && dayjs(evento.start_date_time).year() === dayjs(viewedDate).year()
          && modalityMatch(evento, eventType)
      )
      .map((evento) => dayjs(evento.start_date_time).date())
    return [...new Set(diasComEvento)]
  }, [eventos, eventType, viewedDate])

  const handleMonthChange = useCallback((newDate) => {
    setViewedDate(newDate)
  }, [])

  const handleDateChange = useCallback((newDate) => {
    setSelectedDate(newDate)
    setViewedDate(newDate)
  }, [])

  // Filtra eventos do dia selecionado e pelo tipo
  const eventosDoDia = eventos.filter((evento) => dayjs(evento.start_date_time).isSame(selectedDate, 'day') && modalityMatch(evento, eventType))

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}>
      <Box
        sx={{
          width: { xs: '100%', md: 'auto' },
          minWidth: { md: 350 },
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}>
        <DynamicCalendar
          value={selectedDate}
          onChange={handleDateChange}
          highlightedDays={highlightedDays}
          onMonthChange={handleMonthChange}
          minDate={minDate}
          maxDate={maxDate} />
      </Box>
      <SelectedDatePanel
        selectedDate={selectedDate.toISOString()}
        eventos={eventosDoDia} />
    </Stack>
  )
}

export default function CalendarView({ eventType = 'todos', eventos = EMPTY_ARRAY }) {
  // Calculate min and max dates from events
  const { minDate, maxDate, initialDate } = useMemo(() => {
    if (!eventos || eventos.length === 0) {
      return { minDate: undefined, maxDate: undefined, initialDate: dayjs() }
    }

    const sortedEvents = [...eventos]
      .filter((e) => modalityMatch(e, eventType))
      .sort((a, b) => new Date(a.start_date_time) - new Date(b.start_date_time))

    if (sortedEvents.length === 0) {
      return { minDate: undefined, maxDate: undefined, initialDate: dayjs() }
    }

    const min = dayjs(sortedEvents[0].start_date_time)
    const max = dayjs(sortedEvents[sortedEvents.length - 1].start_date_time)

    // Find closest future event or last event
    const now = dayjs()
    const futureEvent = sortedEvents.find((e) => dayjs(e.start_date_time).isAfter(now))
    const initial = futureEvent ? dayjs(futureEvent.start_date_time) : max

    return { minDate: min, maxDate: max, initialDate: initial }
  }, [eventos, eventType])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CalendarViewContent
        key={initialDate.toString()}
        initialDate={initialDate}
        eventos={eventos}
        eventType={eventType}
        minDate={minDate}
        maxDate={maxDate} />
    </LocalizationProvider>
  )
}
