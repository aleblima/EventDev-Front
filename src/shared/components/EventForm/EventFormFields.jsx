import Box from '@mui/material/Box'

import EventAddress from '@/shared/components/EventForm/EventAddress'
import EventBasicInfo from '@/shared/components/EventForm/EventBasicInfo'

export default function EventFormFields({ evento, handleCepBlur, cepLoading, cepError }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', mt: '2rem' }}>
      <EventBasicInfo evento={evento} />
      <EventAddress
        handleCepBlur={handleCepBlur}
        cepLoading={cepLoading}
        cepError={cepError} />
    </Box>
  )
}
