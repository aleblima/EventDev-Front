import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/shared/providers/useAuth'

export default function FeaturedCard({ comunidade }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const getInitials = (name) => {
    if (!name) {
      return '?'
    }
    return name
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  const logoUrl = comunidade.logoUrl || comunidade.logo_url
  const hasValidLogo = logoUrl && logoUrl.trim() !== '' && typeof logoUrl === 'string'

  const handleLinkClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (user?.communityId === comunidade.id) {
      navigate(`/minha-comunidade/${comunidade.id}`)
    } else {
      navigate(`/comunidades/${comunidade.id}`)
    }
  }

  return (
    <Card
      onClick={handleLinkClick}
      sx={{
        width: {
          xs: '100%',
          sm: 'calc(50% - 8px)',
          md: 'calc(33.333% - 10.67px)',
          lg: 'calc(25% - 12px)'
        },
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'space-between'
      }}>
      <CardActionArea
        sx={{
          paddingTop: '3rem',
          paddingBottom: '2rem',
          paddingX: { xs: '10%', sm: '20%', md: '5%', lg: '7.5%' },
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
        {hasValidLogo
          ? (
              <CardMedia
                component="img"
                image={logoUrl}
                alt={`Logo da comunidade ${comunidade.name}`}
                sx={{
                  height: '100px',
                  width: '100px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifySelf: 'center',
                  margin: '0 auto',
                  objectFit: 'cover',
                  border: '2px solid #00000010'
                }} />
            )
          : (
              <Box
                sx={{
                  height: '100px',
                  width: '100px',
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '2rem',
                    lineHeight: 1
                  }}>
                  {getInitials(comunidade.name)}
                </Typography>
              </Box>
            )}

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="h5"
            paddingBottom="20px">
            {comunidade.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
            {comunidade.description}
          </Typography>
        </CardContent>

        <Link
          fontWeight={700}
          underline="hover"
          variant="caption"
          href={`/comunidades/${comunidade.id}`}
          onClick={handleLinkClick}
          sx={{ marginTop: 'auto' }}>
          Ver perfil
        </Link>
      </CardActionArea>
    </Card>
  )
}
