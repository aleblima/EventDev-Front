import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LinkIcon from '@mui/icons-material/Link'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'

export default function EventDetails({ evento }) {
  const startDate = evento.start_date_time || evento.data_hora_inicial
  const modality = (evento.modality || evento.modalidade || '').toLowerCase()
  const address = evento.address || evento.endereco

  const addressString = (() => {
    if (!address) {
      return 'Endereço Pendente'
    }
    const street = address.streetAddress || address.rua || ''
    const number = address.number || address.numero || ''
    const neighborhood = address.neighborhood || address.bairro || ''
    return `${street}, ${number} - ${neighborhood}`
  })()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarTodayIcon sx={{ color: '#64748B' }} />
        <Typography
          variant="body2"
          sx={{ color: '#64748B' }}>
          {startDate ? dayjs(startDate).format('DD/MM/YYYY') : ''}
        </Typography>
      </Box>
      {modality !== 'online' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlaceOutlinedIcon sx={{ color: '#64748B' }} />
          <Typography
            variant="body2"
            sx={{ color: '#64748B' }}>
            {['presential', 'hybrid'].includes(modality) && addressString}
          </Typography>
        </Box>
      )}
      {evento.link && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon sx={{ color: '#64748B' }} />
          <Link
            href={evento.link}
            underline="hover"
            target="_blank"
            rel="noopener"
            sx={{ color: 'primary.main', textDecoration: 'none' }}>
            Link do evento
          </Link>
        </Box>
      )}
    </Box>
  )
}
