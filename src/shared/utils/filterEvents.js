export function filterEvents(eventos, eventType) {
  return eventos.filter((evento) => {
    const modalidade = (evento.modality || '').toLowerCase()
    if (eventType === 'todos' || eventType === 'eventos') {
      return true
    }
    if (eventType === 'online') {
      return modalidade === 'online'
    }
    if (eventType === 'presencial') {
      return modalidade === 'presential'
    }
    if (eventType === 'híbrido') {
      return modalidade === 'hybrid'
    }
    return true
  })
}
