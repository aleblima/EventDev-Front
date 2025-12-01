import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useFormContext } from 'react-hook-form'

import UploadImg from '@/shared/components/UploadImg'

export default function CommunityRegisterFormFields({ handleImageUpload }) {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
        <Typography
          component="label"
          htmlFor="email"
          variant="subtitle1"
          fontWeight="bold"
          sx={{ marginBottom: '0.5rem' }}>
          Email
        </Typography>
        <TextField
          required
          id="email"
          placeholder="seu@email.com"
          type="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ width: '100%' }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
        <Typography
          component="label"
          htmlFor="password"
          variant="subtitle1"
          fontWeight="bold"
          sx={{ marginBottom: '0.5rem' }}>
          Senha
        </Typography>
        <TextField
          required
          id="password"
          placeholder="********"
          type="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ width: '100%' }} />
        <Typography
          variant="caption"
          sx={{ marginTop: '0.5rem', color: 'text.secondary' }}>
          Mínimo 8 caracteres, uma letra maiúscula e um símbolo
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
        <Typography
          component="label"
          htmlFor="nomeComunidade"
          variant="subtitle1"
          fontWeight="bold"
          sx={{ marginBottom: '0.5rem' }}>
          Nome da Comunidade
        </Typography>
        <TextField
          required
          id="nomeComunidade"
          placeholder="ex: React Nordeste"
          type="text"
          {...register('nomeComunidade')}
          error={!!errors.nomeComunidade}
          helperText={errors.nomeComunidade?.message}
          sx={{ width: '100%' }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
        <Typography
          component="label"
          htmlFor="telefone"
          variant="subtitle1"
          fontWeight="bold"
          sx={{ marginBottom: '0.5rem' }}>
          Telefone:
        </Typography>
        <TextField
          id="telefone"
          type="tel"
          placeholder="(85) 99999-9999"
          {...register('telefone')}
          error={!!errors.telefone}
          helperText={errors.telefone?.message}
          sx={{ flex: 1, minWidth: 200 }} />
      </Box>

      <TextField
        id="descricao"
        label="Descrição da Comunidade"
        placeholder="Descreva o propósito da sua comunidade..."
        multiline
        minRows={5}
        {...register('descricao')}
        error={!!errors.descricao}
        helperText={errors.descricao?.message}
        sx={{ width: '100%', marginBottom: '2rem' }} />

      <UploadImg onImageUpload={handleImageUpload} />

      {/* Links sociais */}
      <Box sx={{ paddingTop: '2rem' }}>
        <Typography
          variant="h2"
          component="h2">
          Links Sociais (Opcionais)
        </Typography>
        <Box sx={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <TextField
            id="instagram"
            label="Instagram"
            placeholder="https://instagram.com/sua-comunidade"
            {...register('instagram')}
            error={!!errors.instagram}
            helperText={errors.instagram?.message}
            sx={{ flex: 1, minWidth: 200 }} />
          <TextField
            id="linkedin"
            label="LinkedIn"
            placeholder="https://linkedin.com/in/sua-comunidade"
            {...register('linkedin')}
            error={!!errors.linkedin}
            helperText={errors.linkedin?.message}
            sx={{ flex: 1, minWidth: 200 }} />
          <TextField
            id="website"
            label="Website"
            placeholder="https://seusite.com.br"
            {...register('website')}
            error={!!errors.website}
            helperText={errors.website?.message}
            sx={{ flex: 1, minWidth: 200 }} />
          <TextField
            id="github"
            label="GitHub"
            placeholder="https://github.com/sua-comunidade"
            {...register('github')}
            error={!!errors.github}
            helperText={errors.github?.message}
            sx={{ flex: 1, minWidth: 200 }} />
        </Box>
      </Box>
    </>
  )
}
