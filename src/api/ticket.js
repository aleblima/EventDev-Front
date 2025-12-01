import { API_BASE_URL } from '@/config/api'

export async function getTicketTypesByEvent(eventId) {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/event/${eventId}/types`, {
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error('Erro ao buscar tipos de ingressos')
    }
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar tipos de ingressos:', error)
    throw error
  }
}

export async function getMyTickets() {
  try {
    // Assuming the backend filters by the logged-in user automatically if userId is not provided
    // or we need to pass the user ID.
    // The TicketController.getAllTickets takes userId as query param.
    // But usually, for "my tickets", the backend should infer from session.
    // Let's check TicketController again.

    // It takes @Query('userId') userId?: number.
    // If I don't pass it, it returns all tickets (if admin) or maybe fails?
    // Wait, getAllTickets in controller doesn't seem to restrict to current user if userId is missing.
    // It uses @VerifySession(), so we have the user.
    // But the implementation passes options?.userId to service.

    // I should probably update the backend to default to current user if not admin.
    // For now, I'll assume I need to pass the user ID or the backend handles it.
    // Since I can't easily get the numeric user ID in the frontend api layer without passing it,
    // I'll rely on the backend endpoint I'll create/modify.

    // Actually, let's use a new endpoint /tickets/my-tickets or similar,
    // or just use /tickets?userId=... if I have the ID.

    // For now, let's try fetching /tickets/me which I will implement.
    const response = await fetch(`${API_BASE_URL}/tickets/me`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar meus ingressos')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar meus ingressos:', error)
    throw error
  }
}
