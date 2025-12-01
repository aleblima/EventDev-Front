import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

import { getMyTickets } from '@/api/ticket'

export default function MyTickets() {
  const [selectedTicket, setSelectedTicket] = useState(null)
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['myTickets'],
    queryFn: getMyTickets
  })

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket)
  }

  const handleCloseTicket = () => {
    setSelectedTicket(null)
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )
    }

    if (!tickets || tickets.length === 0) {
      return <Typography>Você ainda não possui nenhum ingresso.</Typography>
    }

    return (
      <Grid
        container
        spacing={3}>
        {tickets.map((ticket) => (
          <Grid
            size={{ xs: 12, md: 6 }}
            key={ticket.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{ticket.event.title}</Typography>
                <Typography color="text.secondary">{new Date(ticket.event.startDateTime).toLocaleString()}</Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">{ticket.ticketType.name}</Typography>
                  <Chip
                    label={ticket.status.name}
                    color="primary"
                    variant="outlined" />
                </Box>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 2 }}>
                  Comprado em:
                  {' '}
                  {new Date(ticket.purchasedAt).toLocaleDateString()}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleOpenTicket(ticket)}>
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb: 4, paddingTop: '6rem' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ paddingBottom: '2rem' }}>
        Meus Ingressos
      </Typography>

      {renderContent()}

      <Dialog
        open={!!selectedTicket}
        onClose={handleCloseTicket}
        maxWidth="sm"
        fullWidth>
        {selectedTicket && (
          <>
            <DialogTitle>{selectedTicket.event.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
                <QRCodeSVG
                  value={String(selectedTicket.id)}
                  size={256} />
                <Typography
                  variant="caption"
                  color="text.secondary">
                  ID do Ingresso:
                  {' '}
                  {selectedTicket.id}
                </Typography>
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="subtitle2">Participante</Typography>
                  <Typography variant="body1">{selectedTicket.user?.email || 'Você'}</Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{ mt: 2 }}>
                    Tipo de Ingresso
                  </Typography>
                  <Typography variant="body1">{selectedTicket.ticketType.name}</Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{ mt: 2 }}>
                    Data do Evento
                  </Typography>
                  <Typography variant="body1">{new Date(selectedTicket.event.startDateTime).toLocaleString()}</Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{ mt: 2 }}>
                    Status
                  </Typography>
                  <Chip
                    label={selectedTicket.status.name}
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 0.5 }} />
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  )
}
