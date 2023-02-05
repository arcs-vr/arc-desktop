export function getOrGenerateName () {
  return Array(5)
    .fill(0)
    .map(n => (Math.random() * 36 | 0).toString(36))
    .join('')
}
