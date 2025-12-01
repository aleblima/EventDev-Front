import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

export default function DesktopMenu({ pages, handleCloseNavMenu, isAuthenticated, handleLoginClick, communityButtonProps }) {
  return (
    <Box
      sx={{
        flexGrow: 0,
        paddingX: 0,
        display: {
          xs: 'none',
          sm: 'flex'
        },
        alignItems: 'center',
        gap: 1
      }}>
      {pages.map((page) => (
        <Button
          key={page.label}
          variant="text"
          underline="hover"
          onClick={handleCloseNavMenu}
          href={page.path}
          sx={{
            '&': {
              color: '#000000AA',
              alignItems: 'normal',
              fontWeight: '700',
              border: '1px solid #00000022',
              backgroundColor: 'white'
            },
            '&:hover': {
              color: '#E55D2B',
              border: '1px solid #E55D2B'
            }
          }}>
          {page.label}
        </Button>
      ))}
      {!isAuthenticated
        ? (
            <Button
              variant="contained"
              onClick={handleLoginClick}>
              Entrar
            </Button>
          )
        : (
            <>
              {communityButtonProps && (
                <Button
                  variant="text"
                  href={communityButtonProps.disabled ? undefined : communityButtonProps.href}
                  disabled={communityButtonProps.disabled}
                  sx={{
                    color: '#FC692D',
                    fontWeight: '600',
                    opacity: communityButtonProps.disabled ? 0.6 : 1,
                    border: '1px solid #FC692D'
                  }}>
                  {communityButtonProps.text}
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={handleLoginClick}
                sx={{
                  'color': '#ff3c00ff',
                  'borderColor': '#00000022',
                  '&:hover': {
                    backgroundColor: '#fcfcfcff',
                    borderColor: '#ff3c00ff'
                  }
                }}>
                Sair
              </Button>
            </>
          )}
    </Box>
  )
}
