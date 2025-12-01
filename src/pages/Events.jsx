import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { getEvents } from '@/api/event'
import CalendarView from '@/shared/components/CalendarView'
import CardEventGroup from '@/shared/components/CardEvent/CardEventGroup'
import EventTypeSelector from '@/shared/components/EventType'
import Searchbar from '@/shared/components/Searchbar'

function filterBySearchTerm(evento, searchTerm) {
  if (!searchTerm) {
    return true
  }
  const term = searchTerm.toLowerCase()
  const titleMatch = evento.title?.toLowerCase().includes(term)
  const descriptionMatch = evento.description?.toLowerCase().includes(term)
  const communityMatch = evento.community?.name?.toLowerCase().includes(term)

  return titleMatch || descriptionMatch || communityMatch
}

export default function Events() {
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)
  const [eventType, setEventType] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortFilter, setSortFilter] = useState('recent')

  const eventosPorPagina = 12

  // Reset page when filters change
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setPage(1)
  }

  const handleTypeChange = (value) => {
    setEventType(value)
    setPage(1)
  }

  const handleSortChange = (value) => {
    setSortFilter(value)
    setPage(1)
  }

  const {
    data: eventos = [],
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => getEvents()
  })

  const eventosFiltrados = eventos
    .filter((evento) => {
      // Filter by search term
      if (!filterBySearchTerm(evento, searchTerm)) {
        return false
      }

      if (eventType === 'todos') {
        return true
      }

      const modality = evento.modality?.toUpperCase()
      const targetModality = {
        online: 'ONLINE',
        presential: 'PRESENTIAL',
        hybrid: 'HYBRID'
      }[eventType]

      return modality === targetModality
    })
    .sort((a, b) => {
      if (sortFilter === 'recent') {
        return new Date(b.start_date_time) - new Date(a.start_date_time)
      }
      if (sortFilter === 'popular') {
        // Placeholder: sort by title length as a proxy for "popular" or just alphabetical
        return a.title.localeCompare(b.title)
      }
      if (sortFilter === 'nearby') {
        // Placeholder: sort by city if available
        const cityA = a.address?.city || ''
        const cityB = b.address?.city || ''
        return cityA.localeCompare(cityB)
      }
      return 0
    })

  const totalPaginas = Math.ceil(eventosFiltrados.length / eventosPorPagina)
  const eventosPaginados = eventosFiltrados.slice((page - 1) * eventosPorPagina, page * eventosPorPagina)

  const handlePageChange = (event, value) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: 'white'
        }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">Erro ao carregar eventos.</Typography>
      </Box>
    )
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        paddingTop: '6rem',
        paddingBottom: '4rem',
        minHeight: '100vh'
      }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold">
          Eventos
        </Typography>

        <EventTypeSelector
          value={eventType}
          onChange={handleTypeChange} />
      </Stack>

      <Searchbar
        view={view}
        setView={setView}
        placeholderText="Buscar eventos..."
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filter={sortFilter}
        onFilterChange={handleSortChange} />

      {view === 'grid'
        ? (
            <>
              <CardEventGroup eventos={eventosPaginados} />
              {totalPaginas > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '2rem'
                  }}>
                  <Pagination
                    count={totalPaginas}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large" />
                </Box>
              )}
            </>
          )
        : (
            <CalendarView
              eventType={eventType}
              eventos={eventosFiltrados} />
          )}
    </Container>
  )
}
