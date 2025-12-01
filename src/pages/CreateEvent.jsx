import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import { getEnderecoByCep } from '@/api/address'
import { createEvento } from '@/api/event'
import EventFormFields from '@/shared/components/EventForm/EventFormFields'

const FULL_WIDTH = { width: '100%' }

const today = new Date().toISOString().split('T')[0]

function validateTime(data, ctx) {
  if (data.horarioInicial && data.horarioFinal) {
    const [horaIni, minIni] = data.horarioInicial.split(':').map(Number)
    const [horaFim, minFim] = data.horarioFinal.split(':').map(Number)

    const inicialMinutos = horaIni * 60 + minIni
    const finalMinutos = horaFim * 60 + minFim

    if (inicialMinutos >= finalMinutos) {
      ctx.addIssue({
        path: ['horarioFinal'],
        message: 'Horário final deve ser posterior ao horário inicial',
        code: z.ZodIssueCode.custom
      })
    }
  }
}

function validateAddress(data, ctx) {
  if (data.modalidade && data.modalidade !== 'online') {
    const requiredFields = [
      { key: 'cep', msg: 'CEP obrigatório' },
      { key: 'rua', msg: 'Rua obrigatória' },
      { key: 'numero', msg: 'Número obrigatório' },
      { key: 'bairro', msg: 'Bairro obrigatório' },
      { key: 'estado', msg: 'Estado obrigatório' },
      { key: 'cidade', msg: 'Cidade obrigatória' }
    ]

    requiredFields.forEach(({ key, msg }) => {
      if (!data[key]) {
        ctx.addIssue({ path: [key], message: msg, code: z.ZodIssueCode.custom })
      }
    })
  }
}

function prepareEventPayload(data) {
  const startDateTime = `${data.data}T${data.horarioInicial}:00`
  const endDateTime = `${data.data}T${data.horarioFinal}:00`

  return {
    title: data.nomeEvento,
    description: data.descricaoEvento,
    start_date_time: startDateTime,
    end_date_time: endDateTime,
    modality: data.modalidade.toUpperCase(),
    link: data.link || null,
    capa_url: null,
    is_active: true,
    ...(data.modalidade !== 'online' && {
      address: {
        cep: data.cep?.replace(/\D/g, '') || '',
        state: data.estado || '',
        city: data.cidade || '',
        neighborhood: data.bairro || '',
        streetAddress: data.rua || '',
        number: data.numero || ''
      }
    })
  }
}

const schema = z
  .object({
    nomeEvento: z.string().min(1, 'O título do evento é obrigatório'),
    descricaoEvento: z.string().min(1, 'A descrição é obrigatória'),
    data: z.string().refine((val) => val >= today, { message: 'A data não pode ser anterior a hoje' }),
    horarioInicial: z.string().min(1, 'Horário inicial obrigatório'),
    horarioFinal: z.string().min(1, 'Horário final obrigatório'),
    modalidade: z.enum(['presential', 'online', 'hybrid'], {
      required_error: 'Selecione a modalidade do evento',
      invalid_type_error: 'Selecione a modalidade do evento'
    }),
    cep: z.string().optional(),
    rua: z.string().optional(),
    numero: z.string().optional(),
    bairro: z.string().optional(),
    estado: z.string().optional(),
    cidade: z.string().optional(),
    link: z.string().url('Link deve ser uma URL válida').optional().or(z.literal(''))
  })
  .superRefine((data, ctx) => {
    validateTime(data, ctx)
    validateAddress(data, ctx)
  })

async function fetchAddressByCep(cep, setValue, setCepLoading, setCepError) {
  if (!cep || cep.length < 8) {
    return
  }
  setCepLoading(true)
  setCepError('')
  try {
    const endereco = await getEnderecoByCep(cep.replace(/\D/g, ''))
    setValue('rua', endereco.rua)
    setValue('bairro', endereco.bairro)
    setValue('cidade', endereco.cidade)
    setValue('estado', endereco.estado)
  } catch (err) {
    setCepError('CEP não encontrado', err)
    setValue('rua', '')
    setValue('bairro', '')
    setValue('cidade', '')
    setValue('estado', '')
  } finally {
    setCepLoading(false)
  }
}

async function submitEvent(data, comunidadeId, setIsSubmitting, setSubmitError, setShowSuccessToast, navigate) {
  setIsSubmitting(true)
  setSubmitError('')

  try {
    const payload = prepareEventPayload(data)
    await createEvento(comunidadeId, payload)
    setShowSuccessToast(true)
    setTimeout(() => {
      navigate(`/communities/${comunidadeId}`)
    }, 2000)
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    setSubmitError(error.message || 'Erro ao criar evento')
  } finally {
    setIsSubmitting(false)
  }
}

function TipCard() {
  return (
    <Card sx={{ minWidth: 275, maxWidth: 300, height: 'fit-content', display: { xs: 'none', md: 'block' } }}>
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          gutterBottom>
          Dicas para um ótimo evento
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          component="div">
          <Box
            component="ul"
            sx={{ pl: 2, m: 0 }}>
            <li>Escolha um título curto e chamativo.</li>
            <li>Descreva bem o que será abordado.</li>
            <li>Verifique se a data não conflita com feriados.</li>
            <li>Para eventos presenciais, o endereço correto é essencial.</li>
            <li>Adicione uma imagem de capa atraente (em breve).</li>
          </Box>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default function CreateEvent() {
  const { comunidadeId } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState('')
  const navigate = useNavigate()

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      modalidade: ''
    }
  })
  const { handleSubmit, setValue, reset, control } = methods
  const watchedCep = useWatch({
    control,
    name: 'cep',
    defaultValue: ''
  })

  const handleCepBlur = async () => {
    await fetchAddressByCep(watchedCep, setValue, setCepLoading, setCepError)
  }

  const onSubmit = async (data) => {
    await submitEvent(data, comunidadeId, setIsSubmitting, setSubmitError, setShowSuccessToast, navigate)
    reset()
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ paddingTop: '4.5rem', mt: '2rem' }}>
        <Typography
          variant="h2"
          component="h2">
          Criar novo evento
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{ color: '#64748B', mt: '1rem' }}>
          Compartilhe conhecimento e conecte-se com a comunidade criando seu próprio evento.
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
          sx={FULL_WIDTH}>
          Evento criado com sucesso!
        </Alert>
      </Snackbar>

      {submitError && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}>
          {submitError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', mt: '2rem' }}>
        <FormProvider {...methods}>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ flex: 1, maxWidth: '100%', minWidth: 300 }}>
            <EventFormFields
              handleCepBlur={handleCepBlur}
              cepLoading={cepLoading}
              cepError={cepError} />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ mt: 2 }}>
              {isSubmitting ? 'Criando...' : 'Criar Evento'}
            </Button>
          </Box>
        </FormProvider>

        <TipCard />
      </Box>
    </Container>
  )
}
