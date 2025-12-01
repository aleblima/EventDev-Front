import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import { useEventsData } from '@/hooks/useEventsData'
import EventCardItem from '@/shared/components/CardEvent/CardEventHorizontal/EventCardItem'

export default function CardEventHorizontal({ eventos: eventosProp, selectedDate }) {
  const { eventos, loading } = useEventsData(eventosProp, selectedDate)

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

  if (!eventos.length) {
    return (
      <Card sx={{ borderRadius: 2, width: '100%', p: 2 }}>
        <Typography variant="body1">Nenhum evento encontrado.</Typography>
      </Card>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {eventos.map((evento) => (
        <EventCardItem
          key={evento.id}
          evento={evento} />
      ))}
    </Box>
  )
}
