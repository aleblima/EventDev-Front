import { useNavigate } from 'react-router-dom'

import { deleteCommunity } from '@/api/community'
import { deleteEvent } from '@/api/event'

export function useCommunityHandlers(comunidade, setEventosDaComunidade, setToast, setDeleteDialogOpen, setIsDeleting) {
  const navigate = useNavigate()

  const handleEditCommunity = () => {
    if (comunidade?.id) {
      navigate(`/minha-comunidade/${comunidade.id}/editar`)
    }
  }

  const handleCreateEvent = () => {
    if (comunidade?.id) {
      navigate(`/minha-comunidade/${comunidade.id}/eventos/novo`)
    }
  }

  const handleDeleteCommunity = async () => {
    setIsDeleting(true)
    try {
      await deleteCommunity(comunidade.id)
      setToast({ open: true, message: 'Comunidade excluída com sucesso!', severity: 'success' })
      setTimeout(() => navigate('/comunidades'), 2000)
    } catch {
      setToast({ open: true, message: 'Erro ao excluir comunidade. Tente novamente.', severity: 'error' })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleDeleteEvento = async (eventoId) => {
    try {
      await deleteEvent(eventoId)
      setEventosDaComunidade((prev) => prev.filter((evento) => evento.id !== eventoId))
      setToast({ open: true, message: 'Evento excluído com sucesso!', severity: 'success' })
    } catch {
      setToast({ open: true, message: 'Erro ao excluir evento. Tente novamente.', severity: 'error' })
    }
  }

  return { handleEditCommunity, handleCreateEvent, handleDeleteCommunity, handleDeleteEvento }
}
