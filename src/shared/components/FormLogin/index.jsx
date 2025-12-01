import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

import { signIn } from '@/api/auth'
import { useAuth } from '@/shared/providers/useAuth'

import styles from '@/shared/components/FormLogin/Login.module.css'

export default function FormLogin() {
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

    try {
      const response = await signIn({ email, password })

      if (response.status === 'OK') {
        setMessage({ type: 'success', text: 'Login realizado com sucesso!' })

        // Atualizar o contexto de autenticação
        await checkAuth()

        const userData = response

        // Redirecionar baseado no papel do usuário
        if (userData.user && (userData.user.roles.includes('admin') || userData.user.email === 'admin@eventdev.org')) {
          window.location.href = '/admin'
        } else if (userData.user && userData.user.roles.includes('community')) {
          window.location.href = '/'
        } else {
          window.location.href = '/eventos'
        }
      } else {
        setMessage({ type: 'error', text: 'Erro no login. Tente novamente.' })
      }
    } catch (err) {
      // O erro lançado pelo signIn já contém a mensagem do backend se disponível
      const errorMessage = err.message || 'Erro de conexão com o servidor'
      setMessage({ type: 'error', text: errorMessage })
      console.error('Login error:', err)
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
          Bem vindo ao
          {' '}
          <span className={styles.gradientText}>EVENT DEV</span>
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{ color: '#64748B' }}>
          Entre na sua conta agora e comece a criar seus eventos.
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
          autoComplete="current-password"
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
                'ENTRAR'
              )}
        </Button>
      </div>

      <Typography
        variant="body1"
        component="p"
        sx={{ marginTop: '1.5rem', color: '#64748B', fontSize: '0.95rem', textAlign: 'center' }}>
        Esqueceu a senha?
        {' '}
        <Link
          href="/recuperar-senha"
          underline="hover"
          color="text.secondary"
          sx={{ color: '#FC692D', textDecoration: 'none', fontWeight: 'bold' }}>
          Redefinir Senha
        </Link>
      </Typography>

      <Typography
        variant="body1"
        component="p"
        sx={{ marginTop: '1.5rem', color: '#64748B', fontSize: '0.95rem', textAlign: 'center' }}>
        Não tem uma conta?
        {' '}
        <Link
          href="/registrar"
          underline="hover"
          sx={{ color: '#FC692D', fontWeight: 'bold' }}>
          Cadastre-se
        </Link>
      </Typography>
      <Typography
        variant="body1"
        component="p"
        sx={{ marginTop: '1.5rem', color: '#64748B', fontSize: '0.85rem', textAlign: 'center' }}>
        Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
      </Typography>
    </Box>
  )
}
