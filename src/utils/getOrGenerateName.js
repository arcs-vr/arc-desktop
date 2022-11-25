export function getOrGenerateName () {
  const stored = window.localStorage.getItem('arc-name')

  if (stored) {
    return stored
  }

  const name = Array(5)
    .fill(0)
    .map(n => (Math.random() * 36 | 0).toString(36))
    .join('')

  window.localStorage.setItem('arc-name', name)
  return name
}
