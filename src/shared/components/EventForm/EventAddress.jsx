import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useFormContext } from 'react-hook-form'

const FULL_WIDTH = { width: '100%' }
const CAPTION_BLOCK_STYLES = { mt: '0.5rem', color: 'text.secondary', display: 'block' }

function AddressField({ name, label, placeholder, minWidth, flex = 1, ...props }) {
  const {
    register,
    formState: { errors }
  } = useFormContext()
  const error = errors[name]

  return (
    <Box sx={{ flex, minWidth }}>
      <Typography
        component="label"
        variant="subtitle1"
        fontWeight="bold"
        sx={{ mb: '0.5rem', display: 'block' }}>
        {label}
      </Typography>
      <TextField
        id={name}
        placeholder={placeholder || label}
        {...register(name)}
        error={!!error || props.error}
        helperText={error?.message || props.helperText}
        sx={FULL_WIDTH}
        {...props} />
      {props.children}
    </Box>
  )
}

export default function EventAddress({ handleCepBlur, cepLoading, cepError }) {
  const { watch } = useFormContext()
  const watchedModalidade = watch('modalidade')

  if (!watchedModalidade || watchedModalidade === 'online') {
    return null
  }

  return (
    <Box sx={{ display: 'flex', gap: '3rem', mb: '2rem', flexWrap: 'wrap' }}>
      <AddressField
        name="cep"
        label="CEP"
        placeholder="Digite o CEP"
        minWidth={200}
        onBlur={handleCepBlur}
        disabled={cepLoading}
        error={!!cepError}
        helperText={cepError}>
        <Typography
          variant="caption"
          sx={CAPTION_BLOCK_STYLES}>
          Digite o CEP para buscar endereço automaticamente
        </Typography>
      </AddressField>

      <AddressField
        name="rua"
        label="Rua"
        minWidth={200}
        flex={2} />
      <AddressField
        name="numero"
        label="Número"
        minWidth={100} />
      <AddressField
        name="bairro"
        label="Bairro"
        minWidth={150} />
      <AddressField
        name="estado"
        label="Estado"
        minWidth={120} />
      <AddressField
        name="cidade"
        label="Cidade"
        minWidth={120} />
    </Box>
  )
}
