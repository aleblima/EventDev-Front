import MenuIcon from '@mui/icons-material/Menu'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'

import MobileMenuItems from '@/shared/components/Navbar/MobileMenuItems'

export default function MobileMenu({
  isAuthenticated,
  handleLoginClick,
  anchorElNav,
  handleOpenNavMenu,
  handleCloseNavMenu,
  pages,
  userRole,
  communityButtonProps
}) {
  return (
    <Box
      sx={{
        flexGrow: 0,
        paddingX: 0,
        display: {
          xs: 'flex',
          sm: 'none'
        },
        alignItems: 'center',
        gap: 1,
        mr: '0.65rem'
      }}>
      {!isAuthenticated
        ? (
            <Button
              variant="contained"
              onClick={handleLoginClick}>
              Entrar
            </Button>
          )
        : (
            <Button
              variant="outlined"
              onClick={handleLoginClick}
              sx={{
                'color': '#FC692D',
                'borderColor': '#FC692D',
                '&:hover': {
                  backgroundColor: '#E55D2B',
                  borderColor: '#E55D2B',
                  color: 'white'
                }
              }}>
              Sair
            </Button>
          )}
      <IconButton
        id="long-button"
        aria-label="more"
        aria-haspopup="true"
        aria-expanded={anchorElNav ? 'true' : undefined}
        aria-controls={anchorElNav ? 'long-menu' : undefined}
        onClick={handleOpenNavMenu}
        sx={{
          color: 'text.main'
        }}>
        <MenuIcon />
      </IconButton>

      <Menu
        id="long-menu"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: {
            xs: 'block',
            sm: 'none'
          }
        }}
        PaperProps={{
          sx: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            maxWidth: 'none',
            maxHeight: 'calc(100vh - 16px)',
            margin: 0,
            borderRadius: 0,
            backgroundColor: 'white',
            boxShadow: 'none',
            overflow: 'hidden'
          }
        }}
        MenuListProps={{
          sx: {
            padding: 0,
            height: '100%',
            maxHeight: 'calc(100vh - 3rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: '1rem',
            overflowY: 'auto'
          }
        }}>
        <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 300, paddingX: '.8rem' }}>
          <IconButton
            aria-label="Fechar menu"
            onClick={handleCloseNavMenu}
            sx={{ color: 'text.main' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line
                x1="18"
                y1="6"
                x2="6"
                y2="18" />
              <line
                x1="6"
                y1="6"
                x2="18"
                y2="18" />
            </svg>
          </IconButton>
        </Box>
        <Box sx={{ paddingTop: '5rem', paddingX: '2rem', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <MobileMenuItems
            pages={pages}
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            communityButtonProps={communityButtonProps}
            handleCloseNavMenu={handleCloseNavMenu} />
        </Box>
      </Menu>
    </Box>
  )
}
