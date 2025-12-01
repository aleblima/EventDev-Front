import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { signUpCommunity } from '@/api/auth'
import CommunityRegisterFormFields from '@/shared/components/CommunityForm/CommunityRegisterFormFields'
import LogoPreviewCard from '@/shared/components/LogoPreviewCard'

const URL_ERROR_MESSAGE = 'URL inválida. Use formato: https://exemplo.com'

const communitySchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[^a-z0-9]/i, 'A senha deve conter pelo menos um símbolo'),
  nomeComunidade: z.string().min(1, 'Nome da comunidade é obrigatório'),
  descricao: z.string().optional(),
  telefone: z.string().optional(),
  website: z.string().regex(URL_ERROR_MESSAGE, URL_ERROR_MESSAGE).optional().or(z.literal('')),
  instagram: z.string().regex(URL_ERROR_MESSAGE, URL_ERROR_MESSAGE).optional().or(z.literal('')),
  linkedin: z.string().regex(URL_ERROR_MESSAGE, URL_ERROR_MESSAGE).optional().or(z.literal('')),
  github: z.string().regex(URL_ERROR_MESSAGE, URL_ERROR_MESSAGE).optional().or(z.literal(''))
})

function getLogoUrl(uploadedImage) {
  if (!uploadedImage) {
    return undefined
  }

  if (typeof uploadedImage === 'object' && uploadedImage.url) {
    return uploadedImage.url
  }
  if (typeof uploadedImage === 'string' && uploadedImage.trim() !== '') {
    return uploadedImage
  }
  return undefined
}

function prepareCommunityData(data, uploadedImage) {
  const dadosComunidade = {
    email: data.email,
    password: data.password,
    name: data.nomeComunidade,
    description: data.descricao || '',
    phoneNumber: data.telefone || '',
    websiteLink: data.website || '',
    instagramLink: data.instagram || '',
    linkedinLink: data.linkedin || '',
    githubLink: data.github || ''
  }

  const logoUrl = getLogoUrl(uploadedImage)
  if (logoUrl) {
    dadosComunidade.logoUrl = logoUrl
  }
  return dadosComunidade
}

async function handleCommunityRegistration(
  data,
  uploadedImage,
  setIsSubmitting,
  setSubmitError,
  setSubmitSuccess,
  setShowSuccessToast,
  reset,
  setUploadedImage,
  navigate
) {
  setIsSubmitting(true)
  setSubmitError('')
  setSubmitSuccess(false)

  try {
    const dadosComunidade = prepareCommunityData(data, uploadedImage)

    await signUpCommunity(dadosComunidade)

    setSubmitSuccess(true)
    setShowSuccessToast(true)
    reset()
    setUploadedImage(null)

    setTimeout(() => {
      navigate('/login')
    }, 2000)
  } catch (error) {
    console.error('Erro capturado:', error)
    setSubmitError(error.message || 'Erro ao cadastrar comunidade')
  } finally {
    setIsSubmitting(false)
  }
}

export default function CommunityRegister() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const navigate = useNavigate()

  const methods = useForm({
    resolver: zodResolver(communitySchema)
  })
  const { handleSubmit, reset } = methods

  const onSubmit = async (data) => {
    await handleCommunityRegistration(
      data,
      uploadedImage,
      setIsSubmitting,
      setSubmitError,
      setSubmitSuccess,
      setShowSuccessToast,
      reset,
      setUploadedImage,
      navigate
    )
  }

  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData)
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ paddingTop: '4.5rem', marginTop: '2rem' }}>
        <Typography
          variant="h2"
          component="h2">
          Cadastro de Comunidade
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{ color: '#64748B', marginTop: '1rem' }}>
          Crie sua conta e comece a gerenciar seus eventos
        </Typography>
      </Box>

      <Snackbar
        open={showSuccessToast}
        autoHideDuration={3000}
        onClose={() => setShowSuccessToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={() => setShowSuccessToast(false)}
          severity="success"
          sx={{ width: '100%' }}>
          Comunidade cadastrada com sucesso! Redirecionando...
        </Alert>
      </Snackbar>

      {submitError && (
        <Box sx={{ marginTop: '2rem' }}>
          <Alert severity="error">{submitError}</Alert>
        </Box>
      )}

      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem' }}>
          <Box sx={{ flex: 1, maxWidth: '100%', minWidth: 300 }}>
            <CommunityRegisterFormFields handleImageUpload={handleImageUpload} />

            <Box sx={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || submitSuccess}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}>
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Comunidade'}
              </Button>
            </Box>
          </Box>

          <LogoPreviewCard imageData={uploadedImage} />
        </Box>
      </FormProvider>
    </Container>
  )
}
