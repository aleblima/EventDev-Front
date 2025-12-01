export function getModalidadeLabel(modalidade) {
  if (modalidade === 'online') {
    return 'Online'
  }

  if (modalidade === 'presential') {
    return 'Presencial'
  }

  if (modalidade === 'hybrid' || modalidade === 'hibrido') {
    return 'Híbrido'
  }

  return ''
}

export function getModalidadeColor(modalidade) {
  if (modalidade === 'online') {
    return 'primary'
  }

  if (modalidade === 'presential') {
    return 'success'
  }

  if (modalidade === 'hybrid' || modalidade === 'hibrido') {
    return 'secondary'
  }

  return 'default'
}
