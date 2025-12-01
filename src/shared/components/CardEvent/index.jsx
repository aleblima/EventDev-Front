import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LinkIcon from '@mui/icons-material/Link'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

export default function CardEvent({ evento, isOwner = false, onEdit, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!evento || !evento.community) {
    return null
  }

  const handleDeleteClick = () => {
    setConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    setConfirmOpen(false)
    onDelete()
  }

  const handleCancelDelete = () => {
    setConfirmOpen(false)
  }

  const enderecoString = (() => {
    if (evento.modality === 'ONLINE') {
      return 'Evento online'
    }

    if (evento.address) {
      const { streetAddress, number, neighborhood, city, state, cep } = evento.address
      let address = streetAddress || ''
      if (number) {
        address += `, ${number}`
      }
      if (neighborhood) {
        address += ` - ${neighborhood}`
      }
      if (city) {
        address += `, ${city}`
      }
      if (state) {
        address += ` - ${state}`
      }
      if (cep) {
        address += ` (${cep})`
      }

      return address
    }

    return 'Endereço não informado'
  })()

  return (
    <Card sx={{ boxSizing: 'border-box', borderRadius: 2, width: '100%' }}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: 1 }}>
          <Link
            component={RouterLink}
            to={`/comunidades/${evento.community.id}`}
            sx={{
              'display': 'flex',
              'alignItems': 'center',
              'gap': 1,
              'textDecoration': 'none',
              'color': '#000',
              '&:hover': {
                textDecoration: 'underline',
                color: '#000'
              }
            }}>
            <Avatar
              alt={`Logo ${evento.community.name}`}
              src={evento.community.logoUrl || evento.community.logo_url}
              sx={{
                border: '2px solid #00000010'
              }} />
            <Typography
              gutterBottom
              sx={{
                'margin': 0,
                'fontWeight': '700',
                'color': '#000',
                '&:hover': {
                  textDecoration: 'underline',
                  color: '#000'
                }
              }}
              component="div">
              {evento.community.name}
            </Typography>
          </Link>
        </Box>
        <Box sx={{ position: 'relative', width: '100%', height: '350px', margin: 'auto' }}>
          <Link
            component={RouterLink}
            to={`/eventos/${evento.id}`}
            sx={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
            {/* TEMPORARY: Placeholder for event banner */}
            <Box
              sx={{
                width: '100%',
                height: '350px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: (() => {
                  let hash = 0
                  const str = evento.title || ''
                  for (let i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash)
                  }
                  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase()
                  return `#${'00000'.substring(0, 6 - c.length)}${c}`
                })(),
                borderRadius: '5px',
                color: '#FFF',
                fontSize: '4rem',
                fontWeight: 'bold'
              }}>
              {(() => {
                if (!evento.title) {
                  return 'EV'
                }
                // Split by common separators (space, hyphen, dot, underscore, pipe, slash)
                const words = evento.title
                  .trim()
                  .split(/[\s\-_.,|/]+/)
                  .filter((w) => w.length > 0)
                if (words.length >= 2) {
                  return (words[0][0] + words[1][0]).toUpperCase()
                }
                if (words.length === 1) {
                  const word = words[0]
                  // Try to find an internal uppercase letter (CamelCase)
                  const internalCap = word.slice(1).match(/[A-Z]/)
                  if (internalCap) {
                    return (word[0] + internalCap[0]).toUpperCase()
                  }
                  return word.substring(0, 2).toUpperCase()
                }
                return 'EV'
              })()}
            </Box>
            <Box
              sx={{
                px: 2,
                top: 0,
                left: 0,
                width: '100%',
                color: '#fff',
                height: '100%',
                display: 'flex',
                textAlign: 'center',
                position: 'absolute',
                alignItems: 'flex-end',
                justifyContent: 'left'
              }} />
          </Link>
        </Box>
        <CardContent>
          <Link
            component={RouterLink}
            to={`/eventos/${evento.id}`}
            sx={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant="h5"
              component="div"
              color="black"
              sx={{ paddingY: 0.2, textAlign: 'center', fontSize: '15px' }}>
              {evento.title}
            </Typography>
          </Link>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', borderTop: '1px solid #e0e0e0', marginTop: 1, py: 2 }}>
            {evento.description}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon sx={{ color: '#64748B' }} />
              <Typography
                variant="body2"
                sx={{ color: '#64748B' }}>
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ color: '#64748B' }}>
                  {new Intl.DateTimeFormat('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/Sao_Paulo'
                  }).format(new Date(evento.start_date_time))}
                </Typography>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PlaceOutlinedIcon sx={{ color: '#64748B' }} />
              <Typography
                variant="body2"
                sx={{ color: '#64748B' }}>
                {enderecoString}
              </Typography>
            </Box>
            {evento.link && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon sx={{ color: '#64748B' }} />
                <Link
                  href={evento.link}
                  underline="hover"
                  target="_blank"
                  rel="noopener"
                  sx={{ color: 'primary.main', textDecoration: 'none' }}>
                  Acesse o link do evento
                </Link>
              </Box>
            )}
          </Box>
          {isOwner && (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={onEdit}
                sx={{
                  'minWidth': 0,
                  'px': '0 !important',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    boxShadow: 'none'
                  }
                }}
                aria-label="Editar evento">
              </Button>
              <Button
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
                sx={{
                  'minWidth': 0,
                  'px': '0 !important',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    boxShadow: 'none'
                  }
                }}
                aria-label="Excluir evento">
              </Button>
            </Box>
          )}
        </CardContent>
      </Box>
      <Dialog
        open={confirmOpen}
        onClose={handleCancelDelete}>
        <DialogTitle>Excluir evento</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir este evento?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}
