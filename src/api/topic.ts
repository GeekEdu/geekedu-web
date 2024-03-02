import client from './internal/httpClient'

// 图文列表
export function list(params: any) {
  return client.get('/book/api/imageText/v2/list', params)
}

// 获取图文推荐
export function hotList() {
  return client.get('/system/api/v2/imageText/recommend', {})
}

// 获取图文明细
export function detail(id: number) {
  return client.get(`/book/api/imageText/v2/${id}/detail`, {})
}

// 获取图文评论列表
export function comments(id: number, params: any) {
  return client.get(`/book/api/imageText/v2/${id}/comments`, params)
}

export function allComments(id: number, params: any) {
  return client.get(`/addons/MeeduTopics/api/v2/topic/${id}/comments`, params)
}

export function releaseComments(id: number, params: any) {
  return client.post(`/addons/MeeduTopics/api/v1/topic/${id}/comment`, params)
}

export function vote(id: number, params: any) {
  return client.post(
    `/addons/MeeduTopics/api/v1/topic/${id}/vote`,
    params,
  )
}

export function collect(id: number, params: any) {
  return client.post(
    `/addons/MeeduTopics/api/v1/topic/${id}/collect`,
    params,
  )
}

export function submitComment(id: number, params: any) {
  return client.post(`/addons/MeeduTopics/api/v1/topic/${id}/comment`, params)
}
