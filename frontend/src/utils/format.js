export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getErrorMessage(err) {
  return err?.response?.data?.detail || err?.message || 'An unexpected error occurred.'
}
