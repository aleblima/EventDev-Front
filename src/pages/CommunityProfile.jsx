import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useCommunityHandlers } from '@/hooks/useCommunityHandlers'
import { useCommunityProfileData } from '@/hooks/useCommunityProfileData'
import ActionButtons from '@/shared/components/CommunityProfile/ActionButtons'
import CommunityContent from '@/shared/components/CommunityProfile/CommunityContent'
import DangerZone from '@/shared/components/CommunityProfile/DangerZone'
import CommunityProfilePicture from '@/shared/components/CommunityProfilePicture'
import DeleteCommunityDialog from '@/shared/components/DeleteCommunityDialog'
import ToggleCommunityProfile from '@/shared/components/ToggleCommunityProfile'
import { filterEvents } from '@/shared/utils/filterEvents'

export default function CommunityProfile({ isOwner = false }) {
  const { communityId } = useParams()
  const [eventType, setEventType] = useState('eventos')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  const { comunidade, eventosDaComunidade, loading, error, setEventosDaComunidade } = useCommunityProfileData(communityId)

  const { handleEditCommunity, handleCreateEvent, handleDeleteCommunity, handleDeleteEvento } = useCommunityHandlers(
    comunidade,
    setEventosDaComunidade,
    setToast,
    setDeleteDialogOpen,
    setIsDeleting
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (error && !toast.open) {
    setToast({ open: true, message: error, severity: 'error' })
  }

  const handleCloseToast = () => setToast({ ...toast, open: false })

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'white' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    )
  }

  if (!comunidade) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Comunidade não encontrada.</Typography>
      </Box>
    )
  }

  const filteredEventos = filterEvents(eventosDaComunidade, eventType)

  return (
    <Container
      maxWidth="xl"
      sx={{ paddingTop: '4.5rem', marginTop: '2rem' }}>
      <CommunityProfilePicture comunidade={comunidade} />

      <ActionButtons
        isOwner={isOwner}
        onEdit={handleEditCommunity}
        onCreateEvent={handleCreateEvent} />

      <ToggleCommunityProfile
        value={eventType}
        onChange={setEventType} />

      {eventType === 'eventos' && (
        <Typography
          variant="h5"
          sx={{ mt: 4 }}>
          Eventos da Comunidade
        </Typography>
      )}

      <Box mt={4}>
        <CommunityContent
          eventType={eventType}
          comunidade={comunidade}
          filteredEventos={filteredEventos}
          isOwner={isOwner}
          handleDeleteEvento={handleDeleteEvento} />
      </Box>

      <DangerZone
        isOwner={isOwner}
        onDelete={() => setDeleteDialogOpen(true)} />

      <DeleteCommunityDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteCommunity}
        communityName={comunidade?.name}
        isDeleting={isDeleting} />

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
