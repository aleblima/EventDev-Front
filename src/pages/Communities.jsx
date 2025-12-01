import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'

import { getCommunities } from '@/api/community'
import FeaturedCardGroup from '@/shared/components/FeaturedCard/FeaturedCardGroup'
import Searchbar from '@/shared/components/Searchbar'

export default function Communities() {
  const [comunidades, setComunidades] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('recent')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const groupsPerPage = 8

  useEffect(() => {
    const fetchComunidades = async () => {
      try {
        const result = await getCommunities()
        setComunidades(result)
      } catch (error) {
        console.error('Erro ao buscar comunidades:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComunidades()
  }, [])

  const filteredComunidades = useMemo(() => {
    let result = [...comunidades]

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase()
      result = result.filter(
        (community) =>
          community.name.toLowerCase().includes(lowerTerm) || (community.description && community.description.toLowerCase().includes(lowerTerm))
      )
    }

    if (filter === 'recent') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return result
  }, [comunidades, searchTerm, filter])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: 'white'
        }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    )
  }

  const startIndex = (page - 1) * groupsPerPage
  const endIndex = startIndex + groupsPerPage
  const comunidadesToShow = filteredComunidades.slice(startIndex, endIndex)

  const pageCount = Math.ceil(filteredComunidades.length / groupsPerPage)

  const handleChangePage = (_event, value) => {
    setPage(value)
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setPage(1)
  }

  const handleFilterChange = (value) => {
    setFilter(value)
    setPage(1)
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ paddingTop: '4.5rem' }}>
      <Typography
        component="div"
        maxWidth="xl">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'semibold', mt: 3 }}>
          Comunidades
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ marginBottom: '1rem' }}>
          Encontre comunidades de desenvolvedores para participar de eventos e discussões.
        </Typography>
      </Typography>

      <Searchbar
        showToggle={false}
        showFilter={false}
        placeholderText="Buscar community..."
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filter={filter}
        onFilterChange={handleFilterChange}
        filterOptions={[
          { value: 'recent', label: 'Mais recentes' },
          { value: 'popular', label: 'Mais populares' }
        ]} />

      <FeaturedCardGroup comunidades={comunidadesToShow} />

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handleChangePage} />
        </Box>
      )}
    </Container>
  )
}
