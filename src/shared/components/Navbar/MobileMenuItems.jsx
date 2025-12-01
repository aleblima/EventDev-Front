import MenuItem from '@mui/material/MenuItem'

export default function MobileMenuItems({ pages, isAuthenticated, userRole, communityButtonProps, handleCloseNavMenu }) {
  return (
    <>
      {pages.map((page) => (
        <MenuItem
          key={page.label}
          component="a"
          href={page.path}
          onClick={handleCloseNavMenu}
          sx={{
            'textAlign': 'center',
            'color': 'text.main',
            '&:hover': {
              color: 'primary.main'
            }
          }}>
          {page.label}
        </MenuItem>
      ))}

      {isAuthenticated && userRole && (
        <MenuItem
          key="user-role"
          onClick={handleCloseNavMenu}
          sx={{
            textAlign: 'center',
            color: 'gray',
            fontWeight: '400',
            fontSize: '0.75rem',
            cursor: 'default'
          }}>
          {userRole}
        </MenuItem>
      )}

      {isAuthenticated && communityButtonProps && (
        <MenuItem
          key="community-action"
          component={communityButtonProps.disabled ? 'div' : 'a'}
          href={communityButtonProps.disabled ? undefined : communityButtonProps.href}
          onClick={handleCloseNavMenu}
          sx={{
            textAlign: 'center',
            color: '#FC692D',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            opacity: communityButtonProps.disabled ? 0.6 : 1,
            cursor: communityButtonProps.disabled ? 'default' : 'pointer'
          }}>
          {communityButtonProps.text}
        </MenuItem>
      )}
    </>
  )
}
