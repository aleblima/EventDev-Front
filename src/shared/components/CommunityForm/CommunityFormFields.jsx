import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useFormContext } from 'react-hook-form'

import UploadImg from '@/shared/components/UploadImg'

export default function CommunityFormFields({ handleImageUpload }) {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
        <Typography
          component="label"
          htmlFor="nome"
          variant="subtitle1"
          fontWeight="bold"
          sx={{ marginBottom: '0.5rem' }}>
          Nome da Comunidade
        </Typography>
        <TextField
          required
          id="nome"
          placeholder="ex: React Nordeste"
          type="text"
          {...register('nome')}
          error={!!errors.nome}
          helperText={errors.nome?.message}
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
            id="link_instagram"
            label="Instagram"
            placeholder="https://instagram.com/sua-comunidade"
            {...register('link_instagram')}
            error={!!errors.link_instagram}
            helperText={errors.link_instagram?.message}
            sx={{ flex: 1, minWidth: 200 }} />
          <TextField
            id="link_linkedin"
            label="LinkedIn"
            placeholder="https://linkedin.com/in/sua-comunidade"
            {...register('link_linkedin')}
            error={!!errors.link_linkedin}
            helperText={errors.link_linkedin?.message}
            sx={{ flex: 1, minWidth: 200 }} />
          <TextField
            id="link_website"
            label="Website"
            placeholder="https://seusite.com.br"
            {...register('link_website')}
            error={!!errors.link_website}
            helperText={errors.link_website?.message}
            sx={{ flex: 1, minWidth: 200 }} />
          <TextField
            id="link_github"
            label="GitHub"
            placeholder="https://github.com/sua-comunidade"
            {...register('link_github')}
            error={!!errors.link_github}
            helperText={errors.link_github?.message}
            sx={{ flex: 1, minWidth: 200 }} />
        </Box>
      </Box>
    </>
  )
}
