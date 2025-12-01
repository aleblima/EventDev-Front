import FacebookIcon from '@mui/icons-material/Facebook'
import GitHubIcon from '@mui/icons-material/GitHub'
import InstagramIcon from '@mui/icons-material/Instagram'
import LanguageIcon from '@mui/icons-material/Language'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

function getIconByCode(code) {
  switch (code) {
    case 'WEBSITE':
      return <LanguageIcon />
    case 'GITHUB':
      return <GitHubIcon />
    case 'INSTAGRAM':
      return <InstagramIcon />
    case 'LINKEDIN':
      return <LinkedInIcon />
    case 'TWITTER':
      return <TwitterIcon />
    case 'FACEBOOK':
      return <FacebookIcon />
    case 'YOUTUBE':
      return <YouTubeIcon />
    default:
      return <LanguageIcon />
  }
}

function SocialLinks({ links }) {
  if (!links || links.length === 0) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
      {links.map((link) => (
        <Tooltip
          key={link.id}
          title={link.name || link.url}>
          <IconButton
            component="a"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            size="large">
            {getIconByCode(link.linkType?.code)}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  )
}

function CommunityAvatar({ comunidade }) {
  const hasLogo = !!(comunidade.logoUrl || comunidade.logo_url)

  return (
    <Avatar
      src={comunidade.logoUrl || comunidade.logo_url}
      alt={`Logo da ${comunidade.name}`}
      sx={{
        width: { xs: 120, sm: 150, md: 180, lg: 200 },
        height: { xs: 120, sm: 150, md: 180, lg: 200 },
        flexShrink: 0,
        border: '3px solid',
        borderColor: 'divider',
        boxShadow: 2,
        bgcolor: hasLogo ? 'transparent' : 'primary.main',
        color: hasLogo ? 'inherit' : 'primary.contrastText',
        fontSize: { xs: '3rem', sm: '3.5rem', md: '4rem', lg: '4.5rem' },
        fontWeight: 600
      }}>
      {!hasLogo && comunidade.name.charAt(0).toUpperCase()}
    </Avatar>
  )
}

export default function CommunityProfilePicture({ comunidade }) {
  if (!comunidade) {
    return <p>Carregando...</p>
  }

  const links = comunidade.links || []

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          gap: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2 }
        }}>
        <CommunityAvatar comunidade={comunidade} />

        <Box
          sx={{
            flex: 1,
            textAlign: { xs: 'center', md: 'left' },
            minWidth: 0,
            maxWidth: { xs: '100%', md: 'calc(100% - 220px)' }
          }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem', lg: '3rem' },
              fontWeight: 700,
              mb: 1,
              wordBreak: 'break-word',
              lineHeight: 1.2
            }}>
            {comunidade.name}
          </Typography>

          {comunidade.description && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                lineHeight: 1.6,
                maxWidth: { xs: '100%', md: '600px' },
                wordBreak: 'break-word'
              }}>
              {comunidade.description}
            </Typography>
          )}

          <SocialLinks links={links} />
        </Box>
      </Box>
    </Container>
  )
}
