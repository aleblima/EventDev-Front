import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export default function DangerZone({ isOwner, onDelete }) {
  if (!isOwner) {
    return null
  }

  return (
    <Box sx={{ mt: 6, py: 4, borderTop: '1px solid', borderColor: 'divider' }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: 'error.main' }}>
        Zona de Perigo
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3 }}>
        Esta ação é irreversível. Todos os dados da comunidade serão permanentemente excluídos.
      </Typography>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={onDelete}>
        Excluir Comunidade
      </Button>
    </Box>
  )
}
