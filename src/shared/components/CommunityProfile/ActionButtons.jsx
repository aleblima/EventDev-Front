import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'

export default function ActionButtons({ isOwner, onEdit, onCreateEvent }) {
  if (!isOwner) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'start', mb: 1, mt: 2 }}>
      <ButtonGroup
        sx={{
          'borderRadius': '8px',
          '& .MuiButton-root': { px: 3, py: 1, fontWeight: 500, fontSize: '12px', textTransform: 'none', minHeight: '40px' },
          '& .MuiButton-root:first-of-type': { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
          '& .MuiButton-root:last-of-type': { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
        }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={onEdit}>
          Editar
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateEvent}>
          Novo Evento
        </Button>
      </ButtonGroup>
    </Box>
  )
}
