import FacebookIcon from '@mui/icons-material/Facebook'
import GitHubIcon from '@mui/icons-material/GitHub'
import InstagramIcon from '@mui/icons-material/Instagram'
import LanguageIcon from '@mui/icons-material/Language'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import PhoneIcon from '@mui/icons-material/Phone'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const GRID_LAYOUT_STYLE = {
  display: 'grid',
  gridTemplateColumns: '24px 1fr',
  alignItems: 'center',
  columnGap: 2,
  wordBreak: 'break-word'
}

function getIconByCode(code) {
  switch (code) {
    case 'WEBSITE':
      return (
        <LanguageIcon
          fontSize="small"
          color="action" />
      )
    case 'GITHUB':
      return (
        <GitHubIcon
          fontSize="small"
          color="action" />
      )
    case 'INSTAGRAM':
      return (
        <InstagramIcon
          fontSize="small"
          color="action" />
      )
    case 'LINKEDIN':
      return (
        <LinkedInIcon
          fontSize="small"
          color="action" />
      )
    case 'TWITTER':
      return (
        <TwitterIcon
          fontSize="small"
          color="action" />
      )
    case 'FACEBOOK':
      return (
        <FacebookIcon
          fontSize="small"
          color="action" />
      )
    case 'YOUTUBE':
      return (
        <YouTubeIcon
          fontSize="small"
          color="action" />
      )
    default:
      return (
        <LanguageIcon
          fontSize="small"
          color="action" />
      )
  }
}

export default function AboutCommunity({ comunidade }) {
  if (!comunidade) {
    return (
      <Box sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography
          variant="body1"
          color="text.secondary">
          Comunidade não encontrada
        </Typography>
      </Box>
    )
  }

  const renderSocialLink = (link) => {
    if (!link || !link.url) {
      return null
    }

    const icon = getIconByCode(link.linkType?.code)

    return (
      <Box
        key={link.id}
        sx={GRID_LAYOUT_STYLE}>
        {icon}
        <Link
          href={link.url}
          target="_blank"
          rel="noopener"
          underline="hover"
          color="text.secondary"
          sx={{
            fontWeight: 400,
            wordBreak: 'break-word',
            whiteSpace: 'normal'
          }}>
          {link.url}
        </Link>
      </Box>
    )
  }

  const renderPhone = (phone) => {
    if (!phone) {
      return null
    }

    return (
      <Box sx={GRID_LAYOUT_STYLE}>
        <PhoneIcon
          fontSize="small"
          color="action" />
        <Link
          href={`tel:${phone}`}
          underline="hover"
          color="text.secondary"
          sx={{ fontWeight: 400 }}>
          {phone}
        </Link>
      </Box>
    )
  }

  const description = comunidade.description?.trim() || 'Descrição não disponível'
  const links = comunidade.links || []
  const hasLinks = links.length > 0 || comunidade.phoneNumber || comunidade.phone_number

  return (
    <Box sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography
        variant="h5"
        gutterBottom
        fontWeight="bold">
        Sobre a comunidade
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        component="div">
        {description}
      </Typography>

      {hasLinks && (
        <>
          <Typography
            variant="h5"
            gutterBottom
            fontWeight="bold"
            sx={{ mt: 4 }}>
            Canais oficiais
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexWrap: 'wrap' }}>
            {renderPhone(comunidade.phoneNumber || comunidade.phone_number)}
            {links.map((link) => renderSocialLink(link))}
          </Box>
        </>
      )}
    </Box>
  )
}
