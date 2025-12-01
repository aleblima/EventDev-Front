import { useEffect, useState } from 'react'

import { getUserCommunity } from '@/api/community'

export function useUserCommunity(isAuthenticated, isCommunityUser) {
  const [userCommunity, setUserCommunity] = useState(null)
  const [communityLoading, setCommunityLoading] = useState(false)

  useEffect(() => {
    const fetchUserCommunity = async () => {
      if (isAuthenticated && isCommunityUser) {
        setCommunityLoading(true)
        try {
          const community = await getUserCommunity()
          setUserCommunity(community)
        } catch (error) {
          console.error('Erro ao buscar comunidade do usuário:', error)
          setUserCommunity(null)
        } finally {
          setCommunityLoading(false)
        }
      } else {
        setUserCommunity(null)
        setCommunityLoading(false)
      }
    }

    fetchUserCommunity()
  }, [isAuthenticated, isCommunityUser])

  return { userCommunity, communityLoading }
}
