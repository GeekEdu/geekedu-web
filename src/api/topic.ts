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

// 获取图文评论列表 初始化
export function comments(id: number, params: any) {
  return client.get(`/book/api/imageText/v2/${id}/comments`, params)
}

// 图文评论列表 不同参数
export function allComments(id: number, params: any) {
  return client.get(`/book/api/imageText/v2/${id}/comments`, params)
}

// 回复评论
export function releaseComments(id: number, params: any) {
  return client.post(`/book/api/imageText/v2/${id}/comment`, params)
}

// 点赞图文
export function vote(params: any) {
  return client.post(
    `/book/api/imageText/v2/thumb`,
    params,
  )
}

// 收藏图文
export function collect(params: any) {
  return client.post(
    `/book/api/imageText/v2/collect`,
    params,
  )
}

// 评论
export function submitComment(id: number, params: any) {
  return client.post(`/book/api/imageTbookext/vimageText/22${id}/comment`, params)
}
