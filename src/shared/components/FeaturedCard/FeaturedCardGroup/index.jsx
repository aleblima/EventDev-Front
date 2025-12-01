import Box from '@mui/material/Box'

import FeaturedCard from '@/shared/components/FeaturedCard'

export default function FeaturedCardGroup({ comunidades }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: '1.5rem',
        gap: 2,
        justifyContent: 'flex-start'
      }}>
      {comunidades.map((comunidade) => (
        <FeaturedCard
          key={comunidade.id}
          comunidade={comunidade} />
      ))}
    </Box>
  )
}
