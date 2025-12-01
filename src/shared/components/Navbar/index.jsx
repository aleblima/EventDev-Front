import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

import { useUserCommunity } from '@/hooks/useUserCommunity'
import logoImage from '@/shared/assets/static/images/logo.png'
import DesktopMenu from '@/shared/components/Navbar/DesktopMenu'
import MobileMenu from '@/shared/components/Navbar/MobileMenu'
import { useAuth } from '@/shared/providers/useAuth'

const PUBLIC_PAGES = [
  { label: 'Eventos', path: '/eventos' },
  { label: 'Comunidades', path: '/comunidades' }
]

function getUserRole(user) {
  if (!user || !user.roles || user.roles.length === 0) {
    return null
  }

  if (user.roles.includes('platform_admin')) {
    return 'Administrador da Plataforma'
  }
  if (user.roles.includes('admin')) {
    return 'Administrador'
  }
  if (user.roles.includes('community')) {
    return 'Comunidade'
  }
  if (user.roles.includes('user')) {
    return 'Participante'
  }

  return user.roles[0].toUpperCase()
}

function getCommunityButtonProps(isCommunityUser, communityLoading, userCommunity) {
  if (!isCommunityUser) {
    return null
  }

  if (communityLoading) {
    return {
      text: 'Carregando...',
      href: '#',
      disabled: true
    }
  }

  if (userCommunity) {
    return {
      text: 'Meu Perfil',
      href: `/minha-comunidade/${userCommunity.id}`,
      disabled: false
    }
  }

  return {
    text: 'Cadastrar Comunidade',
    href: '/comunidades/nova',
    disabled: false
  }
}

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null)
  const { isAuthenticated, signOut, user } = useAuth()

  const isCommunityUser = user?.roles?.includes('community')
  const { userCommunity, communityLoading } = useUserCommunity(isAuthenticated, isCommunityUser)

  const communityButtonProps = getCommunityButtonProps(isCommunityUser, communityLoading, userCommunity)
  const userRole = getUserRole(user)

  const menuItems = [...PUBLIC_PAGES]
  if (isAuthenticated) {
    menuItems.push({ label: 'Meus Ingressos', path: '/meus-ingressos' })
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleLoginClick = async () => {
    if (isAuthenticated) {
      await signOut()
    } else {
      window.location.href = '/login'
    }
  }

  return (
    <AppBar
      position="fixed"
      color="transparent"
      sx={{
        backgroundColor: '#FFFFFFEE',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
      }}>
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          height: '4.5rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
        <Link href="/">
          <img
            src={logoImage}
            alt="Logo"
            width={180}
            style={{
              marginTop: '.5rem',
              marginRight: '1rem',
              backgroundColor: 'white',
              border: '1px solid #00000018',
              padding: '13.5px 20px 13.5px 20px',
              borderRadius: '10px'
            }} />
        </Link>

        {userRole && (
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.65rem',
              color: 'rgba(250, 129, 30, 1)',
              fontWeight: 400,
              alignSelf: 'center',
              fontStyle: 'italic',
              whiteSpace: 'nowrap'
            }}>
            {userRole}
          </Typography>
        )}

        <Toolbar
          sx={{
            paddingX: '0 !important',
            flexGrow: 1,
            justifyContent: 'flex-end',
            width: {
              sm: '100%'
            }
          }}>
          <MobileMenu
            isAuthenticated={isAuthenticated}
            handleLoginClick={handleLoginClick}
            anchorElNav={anchorElNav}
            handleOpenNavMenu={handleOpenNavMenu}
            handleCloseNavMenu={handleCloseNavMenu}
            pages={menuItems}
            userRole={userRole}
            communityButtonProps={communityButtonProps} />

          <DesktopMenu
            pages={menuItems}
            handleCloseNavMenu={handleCloseNavMenu}
            isAuthenticated={isAuthenticated}
            handleLoginClick={handleLoginClick}
            communityButtonProps={communityButtonProps} />
        </Toolbar>
      </Container>
    </AppBar>
  )
}
