import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'

import EventDetails from '@/shared/components/CardEvent/CardEventHorizontal/EventDetails'
import { getModalidadeColor, getModalidadeLabel } from '@/shared/utils/eventUtils'

function getBannerColor(title) {
  let hash = 0
  const str = title || ''
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase()
  return `#${'00000'.substring(0, 6 - c.length)}${c}`
}

function getBannerInitials(title) {
  if (!title) {
    return 'EV'
  }
  const words = title
    .trim()
    .split(/[\s\-_.,|/]+/)
    .filter((w) => w.length > 0)
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  if (words.length === 1) {
    const word = words[0]
    const internalCap = word.slice(1).match(/[A-Z]/)
    if (internalCap) {
      return (word[0] + internalCap[0]).toUpperCase()
    }
    return word.substring(0, 2).toUpperCase()
  }
  return 'EV'
}

export default function EventCardItem({ evento }) {
  const bannerColor = getBannerColor(evento.title)
  const bannerInitials = getBannerInitials(evento.title)
  const communityName = evento.community?.name || 'Comunidade'
  const communityLogo = evento.community?.logoUrl || evento.community?.logo_url || ''
  const modality = (evento.modality || evento.modalidade || '').toLowerCase()

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        boxSizing: 'border-box',
        width: '100%',
        margin: '0 auto'
      }}>
      <Box
        sx={{
          width: { xs: '100%', sm: 200 },
          height: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bannerColor,
          color: '#FFF',
          fontSize: '3rem',
          fontWeight: 'bold',
          borderBottomLeftRadius: { xs: 0, sm: 8 }
        }}>
        {bannerInitials}
      </Box>
      <CardActionArea
        component={RouterLink}
        to={`/eventos/${evento.id}`}
        sx={{
          flex: 1,
          height: 'auto',
          borderTopRightRadius: 2,
          borderBottomRightRadius: 2,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 2,
          padding: 2,
          textDecoration: 'none',
          color: 'inherit'
        }}>
        <CardContent sx={{ paddingRight: 0, paddingLeft: 1, paddingTop: 0, paddingBottom: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 1 }}>
              <Avatar
                alt={`Logo ${communityName}`}
                src={communityLogo}
                sx={{
                  width: 32,
                  height: 32
                }} />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 500 }}>
                {communityName}
              </Typography>
            </Box>
            <Box>
              <Chip
                label={getModalidadeLabel(modality)}
                color={getModalidadeColor(modality)}
                size="small"
                sx={{ fontSize: '0.7rem', height: 22, paddingX: 0, fontWeight: 600 }} />
            </Box>
          </Box>

          <Typography
            variant="body1"
            component="div"
            sx={{ mb: 1, fontWeight: 600 }}>
            {evento.title}
          </Typography>

          <EventDetails evento={evento} />
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
