import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

import AboutCommunity from '@/shared/components/AboutCommunity'
import CardEvent from '@/shared/components/CardEvent'

export default function CommunityContent({ eventType, comunidade, filteredEventos, isOwner, handleDeleteEvento }) {
  const navigate = useNavigate()

  if (eventType === 'sobre') {
    return <AboutCommunity comunidade={comunidade} />
  }

  if (filteredEventos.length === 0) {
    return <Typography color="text.secondary">Não existe nenhum evento agendado para essa comunidade.</Typography>
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(260px, 1fr))',
          md: 'repeat(2, minmax(300px, 1fr))',
          lg: 'repeat(4, minmax(280px, 1fr))'
        },
        gap: '1.5rem',
        marginBottom: '2rem',
        justifyItems: 'center'
      }}>
      {filteredEventos.map((evento, idx) => (
        <CardEvent
          key={evento.id || idx}
          evento={evento}
          isSingle={filteredEventos.length === 1}
          isOwner={isOwner}
          onEdit={() => navigate(`/eventos/${evento.id}/editar`)}
          onDelete={() => handleDeleteEvento(evento.id)} />
      ))}
    </Box>
  )
}
