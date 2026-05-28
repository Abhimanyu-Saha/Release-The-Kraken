export function useClientId(): string {
  let id = localStorage.getItem('rh_client_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('rh_client_id', id)
  }
  return id
}
