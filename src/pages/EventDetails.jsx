import LinkIcon from '@mui/icons-material/Link'
import PlaceIcon from '@mui/icons-material/Place'
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Grid, Link, Snackbar, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'

import { getEventById } from '@/api/event'
import { createOrder } from '@/api/order'
import { getTicketTypesByEvent } from '@/api/ticket'
import { useAuth } from '@/shared/providers/useAuth'
import { getModalidadeColor, getModalidadeLabel } from '@/shared/utils/eventUtils'

function EventInfo({ event }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          label={getModalidadeLabel((event.modality || event.modalidade || '').toLowerCase())}
          color={getModalidadeColor((event.modality || event.modalidade || '').toLowerCase())} />
      </Box>

      {(event.address || event.modality === 'ONLINE') && (
        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
          <PlaceIcon color="action" />
          <Typography variant="body1">
            {event.modality === 'ONLINE'
              ? (
                  'Evento Online'
                )
              : (
                  <>
                    {event.address.streetAddress}
                    ,
                    {event.address.number}
                    <br />
                    {event.address.neighborhood}
                    {' '}
                    -
                    {event.address.city}
                    /
                    {event.address.state}
                  </>
                )}
          </Typography>
        </Box>
      )}

      {event.link && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon color="action" />
          <Link
            href={event.link}
            target="_blank"
            rel="noopener">
            Link do evento
          </Link>
        </Box>
      )}
    </Box>
  )
}

export default function EventDetails() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })
  const queryClient = useQueryClient()

  const { data: event, isLoading: loadingEvent } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventById(eventId)
  })

  const { data: ticketTypes, isLoading: loadingTickets } = useQuery({
    queryKey: ['ticketTypes', eventId],
    queryFn: () => getTicketTypesByEvent(eventId)
  })

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      if (data.status === 'approved') {
        queryClient.invalidateQueries({ queryKey: ['myTickets'] })
        setToast({ open: true, message: 'Ingresso resgatado com sucesso!', severity: 'success' })
        setTimeout(() => navigate('/meus-ingressos'), 2000)
      } else {
        setToast({ open: true, message: 'Pedido criado. Redirecionando...', severity: 'info' })
        // Here we would redirect to data.initPoint for Mercado Pago
      }
    },
    onError: (error) => {
      let message = error.message
      if (message.includes('Você já possui um ingresso')) {
        message = 'Você já garantiu seu ingresso para este evento! Verifique em "Meus Ingressos".'
      }
      setToast({ open: true, message, severity: 'error' })
    }
  })

  const handleBuy = (ticketType) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (Number(ticketType.price) > 0) {
      setToast({ open: true, message: 'Compra de ingressos pagos em desenvolvimento.', severity: 'info' })
      return
    }

    orderMutation.mutate({
      ticketTypeId: ticketType.id,
      quantity: 1
    })
  }

  if (loadingEvent || loadingTickets) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!event) {
    return <Typography>Evento não encontrado</Typography>
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb: 4, paddingTop: '8.5rem' }}>
      <Grid
        container
        spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography
            variant="h3"
            gutterBottom>
            {event.title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom>
            {new Date(event.start_date_time).toLocaleString()}
          </Typography>

          {event.community && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Link
                component={RouterLink}
                to={`/comunidades/${event.community.id}`}
                sx={{
                  'display': 'flex',
                  'alignItems': 'center',
                  'gap': 1,
                  'textDecoration': 'none',
                  'color': 'inherit',
                  'width': 'fit-content',
                  '&:hover': {
                    textDecoration: 'none',
                    opacity: 0.8
                  }
                }}>
                <Avatar
                  src={event.community.logoUrl || event.community.logo_url}
                  alt={event.community.name}
                  sx={{ width: 40, height: 40 }} />
                <Typography
                  variant="h6"
                  component="span">
                  {event.community.name}
                </Typography>
              </Link>
            </Box>
          )}

          <EventInfo event={event} />

          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              gutterBottom>
              Sobre o evento
            </Typography>
            <Typography paragraph>{event.description}</Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom>
                Ingressos
              </Typography>
              {ticketTypes?.map((ticket) => (
                <Box
                  key={ticket.id}
                  sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Typography variant="h6">{ticket.name}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary">
                    {ticket.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ mt: 1 }}>
                    {Number(ticket.price) === 0 ? 'Grátis' : `R$ ${ticket.price}`}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleBuy(ticket)}
                    disabled={orderMutation.isPending || ticket.quantity <= 0}>
                    {Number(ticket.price) === 0 ? 'Resgatar' : 'Comprar'}
                  </Button>
                  {ticket.quantity <= 0 && (
                    <Typography
                      variant="caption"
                      color="error"
                      display="block"
                      sx={{ mt: 1 }}>
                      Esgotado
                    </Typography>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
