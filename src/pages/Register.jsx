import Container from '@mui/material/Container'

import FormRegister from '@/shared/components/FormRegister'

export default function Register() {
  return (
    <Container
      maxWidth="xl"
      sx={{ paddingTop: '3.5rem' }}>
      <FormRegister />
    </Container>
  )
}
