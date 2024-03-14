import client from './internal/httpClient'

export function list(params: any) {
  return client.get('/book/api/path/v2/list', params)
}

export function create(params: any) {
  return client.get('/label/api/category/getCategoryList?type=LEARN_PATH', params)
}

export function detail(id: number) {
  return client.get(`/book/api/path/v2/${id}/detail`, {})
}
