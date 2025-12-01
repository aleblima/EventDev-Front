import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

import { signUp } from '@/api/auth'
import { useAuth } from '@/shared/providers/useAuth'

import styles from '@/shared/components/FormRegister/Register.module.css'

export default function FormRegister() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const { checkAuth } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' })
      setLoading(false)
      return
    }

    try {
      const response = await signUp({ email, password })

      if (response.status === 'OK') {
        setMessage({ type: 'success', text: 'Cadastro realizado com sucesso! Fazendo login...' })

        // Auto login (checkAuth might not work immediately if session is not set by signUp,
        // but my backend signUp DOES set session)
        await checkAuth()

        // Redirect to home or events
        window.location.href = '/eventos'
      } else {
        setMessage({ type: 'error', text: 'Erro no cadastro. Tente novamente.' })
      }
    } catch (err) {
      const errorMessage = err.message || 'Erro de conexão com o servidor'
      setMessage({ type: 'error', text: errorMessage })
      console.error('Register error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      className={styles.container}
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="on">
      <div className={styles.titleContainer}>
        <Typography
          variant="h2"
          component="h2"
          sx={{ marginBottom: '1rem' }}>
          Crie sua conta no
          {' '}
          <span className={styles.gradientText}>EVENT DEV</span>
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{ color: '#64748B' }}>
          Cadastre-se para comprar ingressos e participar de eventos.
        </Typography>
      </div>

      {message.text && (
        <Alert
          severity={message.type}
          sx={{ marginTop: '1rem' }}>
          {message.text}
        </Alert>
      )}

      <div className={styles.formContainer}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#E2E8F0' },
              '&:hover fieldset': { borderColor: '#FC692D' },
              '&.Mui-focused fieldset': { borderColor: '#FC692D' }
            }
          }} />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Senha"
          type="password"
          id="password"
          autoComplete="new-password"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#E2E8F0' },
              '&:hover fieldset': { borderColor: '#FC692D' },
              '&.Mui-focused fieldset': { borderColor: '#FC692D' }
            }
          }} />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirmar Senha"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#E2E8F0' },
              '&:hover fieldset': { borderColor: '#FC692D' },
              '&.Mui-focused fieldset': { borderColor: '#FC692D' }
            }
          }} />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          className={styles.btn}
          disabled={loading}>
          {loading
            ? (
                <CircularProgress
                  size={24}
                  color="inherit" />
              )
            : (
                'CADASTRAR'
              )}
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <Typography
            variant="body2"
            color="text.secondary">
            Já tem uma conta?
            {' '}
            <Link
              href="/login"
              underline="hover"
              sx={{ color: '#FC692D', fontWeight: 'bold' }}>
              Faça login
            </Link>
          </Typography>
        </Box>
      </div>
    </Box>
  )
}
