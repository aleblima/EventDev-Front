import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import { getCommunityById, updateCommunity } from '@/api/community'
import CommunityFormFields from '@/shared/components/CommunityForm/CommunityFormFields'
import LogoPreviewCard from '@/shared/components/LogoPreviewCard'

const urlRegex = /^https?:\/\/(www\.)?[-\w@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-\w()@:%+.~#?&/=]*)$/
const URL_ERROR_MESSAGE = 'URL inválida. Use formato: https://exemplo.com'

const communitySchema = z.object({
  nome: z.string().min(1, 'Nome da comunidade é obrigatório'),
  descricao: z.string().optional(),
  telefone: z.string().optional(),
  link_website: z.string().regex(urlRegex, URL_ERROR_MESSAGE).optional().or(z.literal('')),
  link_instagram: z.string().regex(urlRegex, URL_ERROR_MESSAGE).optional().or(z.literal('')),
  link_linkedin: z.string().regex(urlRegex, URL_ERROR_MESSAGE).optional().or(z.literal('')),
  link_github: z.string().regex(urlRegex, URL_ERROR_MESSAGE).optional().or(z.literal('')),
  logo_url: z.string().optional().or(z.literal(''))
})

function getValue(obj, keys) {
  for (const key of keys) {
    if (obj[key]) {
      return obj[key]
    }
  }
  return ''
}

function mapCommunityDataToForm(comunidadeData) {
  return {
    nome: getValue(comunidadeData, ['nome', 'name']),
    descricao: getValue(comunidadeData, ['descricao', 'description']),
    telefone: getValue(comunidadeData, ['telefone', 'phone_number']),
    link_website: comunidadeData.link_website || '',
    link_instagram: comunidadeData.link_instagram || '',
    link_linkedin: comunidadeData.link_linkedin || '',
    link_github: comunidadeData.link_github || '',
    logo_url: comunidadeData.logo_url || ''
  }
}

async function loadCommunityData(communityId, reset, setComunidade, setUploadedImage, setSubmitError, setIsLoading) {
  try {
    setIsLoading(true)
    setSubmitError('')

    if (!communityId) {
      setSubmitError('ID da comunidade não fornecido')
      return
    }

    const comunidadeData = await getCommunityById(communityId)

    if (!comunidadeData) {
      setSubmitError('Comunidade não encontrada')
      return
    }

    setComunidade(comunidadeData)
    reset(mapCommunityDataToForm(comunidadeData))

    if (comunidadeData.logo_url) {
      setUploadedImage(comunidadeData.logo_url)
    }
  } catch (fetchError) {
    setSubmitError(`Erro ao carregar dados da comunidade: ${fetchError.message}`)
  } finally {
    setIsLoading(false)
  }
}

export default function CommunityEdit() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitError, setSubmitError] = useState('')
  const [, setSubmitSuccess] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [comunidade, setComunidade] = useState(null)

  const navigate = useNavigate()
  const { communityId } = useParams()

  const methods = useForm({
    resolver: zodResolver(communitySchema),
    defaultValues: {}
  })
  const { handleSubmit, reset } = methods

  useEffect(() => {
    loadCommunityData(communityId, reset, setComunidade, setUploadedImage, setSubmitError, setIsLoading)
  }, [communityId, reset])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      const dataCommunity = {
        ...data,
        logo_url: uploadedImage || comunidade.logo_url || ''
      }

      await updateCommunity(communityId, dataCommunity)

      setComunidade((prev) => ({ ...prev, ...dataCommunity }))
      setSubmitSuccess(true)
      setShowSuccessToast(true)

      setTimeout(() => {
        navigate(`/minha-comunidade/${comunidade.id}`)
      }, 2000)
    } catch (updateError) {
      setSubmitError(`Erro ao atualizar comunidade: ${updateError.message}`)
      setShowErrorToast(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData)
  }

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
            paddingTop: '4.5rem'
          }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (submitError && !comunidade) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ paddingTop: '4.5rem', marginTop: '2rem' }}>
          <Alert severity="error">{submitError}</Alert>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ paddingTop: '4.5rem', marginTop: '2rem' }}>
        <Typography
          variant="h2"
          component="h2">
          Editar Comunidade
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{ color: '#64748B', marginTop: '1rem' }}>
          Atualize as informações da sua comunidade
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
          Comunidade editada com sucesso!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showErrorToast}
        autoHideDuration={4000}
        onClose={() => setShowErrorToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={() => setShowErrorToast(false)}
          severity="error"
          sx={{ width: '100%' }}>
          {submitError || 'Erro ao editar comunidade.'}
        </Alert>
      </Snackbar>

      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem' }}>
          <Box sx={{ flex: 1, maxWidth: '100%', minWidth: 300 }}>
            <CommunityFormFields handleImageUpload={handleImageUpload} />

            <Box sx={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}>
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </Box>
          </Box>

          <LogoPreviewCard imageData={uploadedImage} />
        </Box>
      </FormProvider>
    </Container>
  )
}
