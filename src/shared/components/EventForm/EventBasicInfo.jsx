import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Controller, useFormContext } from 'react-hook-form'

import BannerImg from '@/shared/components/UploadBanner'

const FULL_WIDTH = { width: '100%' }
const FORM_CONTROL_STYLES = { display: 'flex', flexDirection: 'column', mb: '2rem' }
const CAPTION_STYLES = { mt: '0.5rem', color: 'text.secondary' }
const CAPTION_BLOCK_STYLES = { mt: '0.5rem', color: 'text.secondary', display: 'block' }
const today = new Date().toISOString().split('T')[0]

export default function EventBasicInfo({ evento }) {
  const {
    register,
    control,
    formState: { errors },
    watch
  } = useFormContext()
  const watchedModalidade = watch('modalidade')

  return (
    <Box sx={{ flex: 1, maxWidth: '100%', minWidth: 300 }}>
      {/* Event Title */}
      <Box sx={FORM_CONTROL_STYLES}>
        <Typography
          component="label"
          htmlFor="nomeEvento"
          variant="subtitle1"
          fontWeight="bold"
          sx={{ mb: '0.5rem' }}>
          Título do Evento
        </Typography>
        <TextField
          required
          id="nomeEvento"
          placeholder="Workshop React: construindo aplicações modernas"
          {...register('nomeEvento')}
          error={!!errors.nomeEvento}
          helperText={errors.nomeEvento?.message}
          sx={FULL_WIDTH} />
        <Typography
          variant="caption"
          sx={CAPTION_STYLES}>
          Um título claro e atrativo para seu evento.
        </Typography>
      </Box>

      {/* Description */}
      <Box sx={FORM_CONTROL_STYLES}>
        <Typography
          component="label"
          htmlFor="descricaoEvento"
          variant="subtitle1"
          fontWeight="bold"
          sx={{ mb: '0.5rem' }}>
          Descrição
        </Typography>
        <TextField
          id="descricaoEvento"
          placeholder="Faça uma breve descrição do seu evento..."
          name="descricaoEvento"
          type="text"
          multiline
          minRows={5}
          {...register('descricaoEvento')}
          error={!!errors.descricaoEvento}
          helperText={errors.descricaoEvento?.message}
          sx={FULL_WIDTH} />
        <Typography
          variant="caption"
          sx={CAPTION_STYLES}>
          Descreva seu evento em detalhes para atrair o público certo
        </Typography>
      </Box>

      <BannerImg imageData={evento?.capa_url} />

      <Box sx={{ paddingTop: '2rem' }}>
        <Box sx={{ display: 'flex', gap: '2rem', mb: '2rem', flexWrap: 'wrap', mt: '2rem' }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            {/* Date */}
            <Typography
              component="label"
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: '0.5rem', display: 'block' }}>
              Data do Evento
            </Typography>
            <TextField
              id="data"
              placeholder="Selecione uma data"
              type="date"
              inputProps={{ min: today }}
              {...register('data')}
              error={!!errors.data}
              helperText={errors.data?.message}
              sx={FULL_WIDTH} />
            <Typography
              variant="caption"
              sx={CAPTION_BLOCK_STYLES}>
              A data em que o evento ocorrerá
            </Typography>
          </Box>
          {/* Event Timepicker */}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography
              component="label"
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: '0.5rem', display: 'block' }}>
              Horário Inicial
            </Typography>
            <TextField
              id="horarioInicial"
              type="time"
              {...register('horarioInicial')}
              error={!!errors.horarioInicial}
              helperText={errors.horarioInicial?.message}
              sx={FULL_WIDTH} />
            <Typography
              variant="caption"
              sx={CAPTION_BLOCK_STYLES}>
              Horário que começa seu evento
            </Typography>
          </Box>
          {/* Event End-Time */}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography
              component="label"
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: '0.5rem', display: 'block' }}>
              Horário Final
            </Typography>
            <TextField
              id="horarioFinal"
              type="time"
              placeholder="00:00"
              {...register('horarioFinal')}
              error={!!errors.horarioFinal}
              helperText={errors.horarioFinal?.message}
              sx={FULL_WIDTH} />
            <Typography
              variant="caption"
              sx={CAPTION_BLOCK_STYLES}>
              Horário que termina seu evento
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: '3rem', mb: '2rem', flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <FormControl
              fullWidth
              error={!!errors.modalidade}>
              <InputLabel id="modalidade-label">Modalidade do Evento</InputLabel>
              <Controller
                name="modalidade"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="modalidade-label"
                    id="modalidade"
                    label="Modalidade do Evento">
                    <MenuItem value="presential">Presencial</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="hybrid">Híbrido</MenuItem>
                  </Select>
                )} />
            </FormControl>
            <Typography
              variant="caption"
              sx={CAPTION_BLOCK_STYLES}>
              Selecione o tipo de modalidade do evento
            </Typography>
            {errors.modalidade && (
              <Typography
                variant="caption"
                color="error.main"
                sx={{ display: 'block' }}>
                {errors.modalidade.message}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Link do evento (opcional para eventos online) */}
        {watchedModalidade === 'online' && (
          <Box sx={FORM_CONTROL_STYLES}>
            <Typography
              component="label"
              htmlFor="link"
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: '0.5rem' }}>
              Link do Evento (Opcional)
            </Typography>
            <TextField
              id="link"
              placeholder="https://meet.google.com/..."
              {...register('link')}
              error={!!errors.link}
              helperText={errors.link?.message}
              sx={FULL_WIDTH} />
            <Typography
              variant="caption"
              sx={CAPTION_STYLES}>
              Link para acesso ao evento online
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
