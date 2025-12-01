import GitHub from '@mui/icons-material/GitHub'
import Instagram from '@mui/icons-material/Instagram'
import WhatsApp from '@mui/icons-material/WhatsApp'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import logoDigital from '@/shared/assets/static/images/digital-college.png'
import logoGeracao from '@/shared/assets/static/images/geracao-tech.png'
import logo from '@/shared/assets/static/images/logo.png'

export default function Footer() {
  return (
    <Box sx={{ marginTop: '5rem', padding: '2rem', width: '100%', borderTop: '1px solid #e0e0e0' }}>
      <Box sx={{ margin: '0 auto' }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            justifyContent: 'space-between'
          }}>
          <Box
            sx={{
              flexGrow: 1,
              flexBasis: { xs: '100%', md: '60%' },
              minWidth: '280px'
            }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4 }}>
              <Box sx={{ flex: 1, maxWidth: '400px' }}>
                <Box sx={{ mb: 2 }}>
                  <Link href="/">
                    <img
                      src={logo}
                      width={180}
                      alt="Logo EventDev" />
                  </Link>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary">
                  Conectando comunidades de desenvolvedores do nordeste através de eventos incríveis. Encontre eventos, crie sua comunidade e faça
                  parte deste ecossistema.
                </Typography>
              </Box>
              <Box sx={{ minWidth: '120px' }}>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mb: 1 }}>
                  Navegue
                </Typography>
                <Link
                  href="/eventos"
                  underline="hover"
                  color="text.secondary"
                  display="block"
                  sx={{ mb: 1 }}>
                  Eventos
                </Link>
                <Link
                  href="/comunidades"
                  underline="hover"
                  color="text.secondary"
                  display="block"
                  sx={{ mb: 1 }}>
                  Comunidades
                </Link>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              flexBasis: { xs: '100%', md: '35%' },
              minWidth: '200px'
            }}>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ mb: 1 }}>
              Apoio
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 8 }}>
              <Link
                href="https://geracaotech.iel-ce.org.br/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ maxWidth: 130 }}>
                <img
                  src={logoGeracao}
                  alt="Geração Tech 2.0"
                  style={{ width: '100%', height: 'auto' }} />
              </Link>
              <Link
                href="https://digitalcollege.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ maxWidth: 130 }}>
                <img
                  src={logoDigital}
                  alt="Digital College"
                  style={{ width: '100%', height: 'auto' }} />
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ margin: '0 auto' }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center">
          <Grid>
            <Typography
              variant="body2"
              color="text.secondary">
              Built with 💙 by the
              {' '}
              <Link
                href=""
                underline="hover"
                color="primary">
                EventDev
              </Link>
              {' '}
              community.
            </Typography>
          </Grid>
          <Grid>
            <Box>
              <IconButton
                href="https://www.instagram.com/eventdev.ce"
                target="_blank"
                size="small"
                rel="noopener noreferrer">
                <Instagram />
              </IconButton>
              <IconButton
                href="https://github.com/EventDev-Communities"
                target="_blank"
                size="small"
                rel="noopener noreferrer">
                <GitHub />
              </IconButton>
              <IconButton
                href="https://chat.whatsapp.com/LEjECdsm9iXAIqnECfJ8Q0"
                target="_blank"
                size="small"
                rel="noopener noreferrer">
                <WhatsApp />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
