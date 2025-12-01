import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import Session from 'supertokens-auth-react/recipe/session'

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  signOut: () => {},
  checkAuth: () => {}
})

async function fetchUserData() {
  try {
    const response = await fetch('http://localhost:5122/api/v1/auth/me', {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      return null
    }

    const userData = await response.json()
    let normalizedUser = userData.user

    if (normalizedUser && normalizedUser.roles?.includes('community')) {
      if (normalizedUser.communityId) {
        normalizedUser = { ...normalizedUser, communityId: normalizedUser.communityId }
      } else if (normalizedUser.community?.id) {
        normalizedUser = { ...normalizedUser, communityId: normalizedUser.community.id }
      }
    }
    return normalizedUser
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
  }
  return null
}

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      const sessionExists = await Session.doesSessionExist()

      if (sessionExists) {
        setIsAuthenticated(true)
        const userData = await fetchUserData()
        if (userData) {
          setUser(userData)
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await Session.signOut()
      setIsAuthenticated(false)
      setUser(null)
      window.location.href = '/login'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Forçar logout local mesmo se der erro
      setIsAuthenticated(false)
      setUser(null)
      window.location.href = '/'
    }
  }, [])

  useEffect(() => {
    checkAuth()

    // Não há addEventListener no SuperTokens React, mas podemos verificar periodicamente
    // ou usar outros métodos de sincronização se necessário
  }, [checkAuth])

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      loading,
      signOut,
      checkAuth
    }),
    [isAuthenticated, user, loading, signOut, checkAuth]
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export default AuthProvider
export { AuthContext }
