import client from './internal/httpClient'

export function list() {
  return client.get('/exam/api/v2/count/list', {})
}
