import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import { createEndereco, getEnderecoByCep, updateEndereco } from '@/api/address'
import { getEventById, updateEvent } from '@/api/event'
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
        code: 'custom'
      })
    }
  }
}

function validateAddress(data, ctx) {
  if (data.modalidade && data.modalidade !== 'online') {
    const requiredFields = ['cep', 'rua', 'numero', 'bairro', 'estado', 'cidade']
    const fieldLabels = {
      cep: 'CEP',
      rua: 'Rua',
      numero: 'Número',
      bairro: 'Bairro',
      estado: 'Estado',
      cidade: 'Cidade'
    }
    requiredFields.forEach((field) => {
      if (!data[field]) {
        ctx.addIssue({ path: [field], message: `${fieldLabels[field]} obrigatório`, code: 'custom' })
      }
    })
  }
}

function refineEventSchema(data, ctx) {
  validateTime(data, ctx)
  validateAddress(data, ctx)
}

const eventSchema = z
  .object({
    nomeEvento: z.string().min(1, 'O título do Evento é obrigatório'),
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
  .superRefine(refineEventSchema)

function getSafeValue(val) {
  return val || ''
}

function mapAddressToForm(endereco) {
  return {
    cep: getSafeValue(endereco?.cep),
    rua: getSafeValue(endereco?.rua),
    numero: getSafeValue(endereco?.numero),
    bairro: getSafeValue(endereco?.bairro),
    estado: getSafeValue(endereco?.estado),
    cidade: getSafeValue(endereco?.cidade)
  }
}

function mapEventToForm(evento) {
  const { endereco } = evento
  const [data, horaInicial] = (evento.data_hora_inicial || '').split('T')
  const [, horaFinal] = (evento.data_hora_final || '').split('T')

  return {
    nomeEvento: getSafeValue(evento.titulo),
    descricaoEvento: getSafeValue(evento.descricao),
    data: getSafeValue(data),
    horarioInicial: getSafeValue(horaInicial?.slice(0, 5)),
    horarioFinal: getSafeValue(horaFinal?.slice(0, 5)),
    modalidade: getSafeValue(evento.modalidade),
    link: getSafeValue(evento.link),
    ...mapAddressToForm(endereco)
  }
}

async function loadEventData(eventoId, setEvento, setEnderecoId, reset, setSubmitError) {
  try {
    const eventoEncontrado = await getEventById(eventoId)
    if (!eventoEncontrado) {
      setSubmitError('Evento não encontrado')
      return
    }
    setEvento(eventoEncontrado)
    setEnderecoId(eventoEncontrado.id_endereco || null)

    reset(mapEventToForm(eventoEncontrado))
  } catch (err) {
    setSubmitError('Erro ao carregar evento', err)
  }
}

async function submitEventUpdate(data, eventoId, enderecoId, evento, setIsSubmitting, setSubmitError, setShowSuccessToast, navigate) {
  setIsSubmitting(true)
  setSubmitError('')

  try {
    const startDateTime = `${data.data}T${data.horarioInicial}:00`
    const endDateTime = `${data.data}T${data.horarioFinal}:00`

    let novoEnderecoId = enderecoId

    if (data.modalidade !== 'online') {
      const enderecoData = {
        cep: data.cep.replace(/\D/g, ''),
        rua: data.rua,
        numero: data.numero,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado
      }

      if (enderecoId) {
        await updateEndereco(enderecoId, enderecoData)
      } else {
        const novoEndereco = await createEndereco(enderecoData)
        novoEnderecoId = novoEndereco.id
      }
    }

    const eventoAtualizado = {
      titulo: data.nomeEvento,
      descricao: data.descricaoEvento,
      data_hora_inicial: startDateTime,
      data_hora_final: endDateTime,
      modalidade: data.modalidade,
      link: data.link || null,
      id_endereco: data.modalidade === 'online' ? null : novoEnderecoId
    }

    await updateEvent(eventoId, eventoAtualizado)
    setShowSuccessToast(true)
    setTimeout(() => {
      navigate(`/communities/${evento.id_comunidade}`)
    }, 2000)
  } catch (err) {
    console.error('Erro ao atualizar evento:', err)
    setSubmitError(err.message || 'Erro ao atualizar evento')
  } finally {
    setIsSubmitting(false)
  }
}

async function fetchAddress(cep, setValue, setCepLoading, setCepError) {
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

export default function EditEvent() {
  const { eventoId } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState('')
  const [evento, setEvento] = useState(null)
  const [enderecoId, setEnderecoId] = useState(null)
  const navigate = useNavigate()

  const methods = useForm({
    resolver: zodResolver(eventSchema),
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

  useEffect(() => {
    loadEventData(eventoId, setEvento, setEnderecoId, reset, setSubmitError)
  }, [eventoId, reset])

  const handleCepBlur = async () => {
    fetchAddress(watchedCep, setValue, setCepLoading, setCepError)
  }

  const onSubmit = async (data) => {
    submitEventUpdate(data, eventoId, enderecoId, evento, setIsSubmitting, setSubmitError, setShowSuccessToast, navigate)
  }

  if (!evento) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography variant="h6">Carregando evento...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ paddingTop: '4.5rem', mt: '2rem' }}>
        <Typography
          variant="h2"
          component="h2">
          Editar evento
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{ color: '#64748B', mt: '1rem' }}>
          Atualize as informações do seu evento
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
          Evento editado com sucesso!
        </Alert>
      </Snackbar>

      {submitError && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}>
          {submitError}
        </Alert>
      )}

      <FormProvider {...methods}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}>
          <EventFormFields
            evento={evento}
            handleCepBlur={handleCepBlur}
            cepLoading={cepLoading}
            cepError={cepError} />

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 2 }}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </Box>
      </FormProvider>
    </Container>
  )
}
