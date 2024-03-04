import client from './internal/httpClient'

// 电子书列表
export function list(params: any) {
  return client.get('/book/api/eBook/v2/book/list', params)
}

// 获取电子书推荐
export function hotList() {
  return client.get('/system/api/v2/eBook/recommend', {})
}

// 获取某电子书明细
export function detail(id: number) {
  return client.get(`/book/api/eBook/v2/book/${id}/detail`, {})
}

// 点赞状态
export function likeStatus(params: any) {
  return client.get(`/book/api/eBook/v2/book/thumb/status`, params)
}

export function likeHit(params: any) {
  return client.get(`/addons/templateOne/api/v1/like/hit`, params)
}

// 获取电子书评论
export function bookComments(id: number, params: any) {
  return client.get(
    `/book/api/eBook/v2/book/${id}/comments`,
    params,
  )
}

// 新增电子书评论
export function submitBookComment(id: number, params: any) {
  return client.post(
    `/book/api/eBook/v2/book/${id}/comment`,
    params,
  )
}

// 文章 一级评论
export function comments(id: number, params: any) {
  return client.get(
    `/book/api/eBook/v2/article/${id}/comments`,
    params,
  )
}

// 文章 新增评论
export function submitComment(id: number, params: any) {
  return client.post(
    `/book/api/eBook/v2/article/${id}/comment`,
    params,
  )
}

// 文章 二级评论
export function answerComments(id: number, params: any) {
  return client.get(
    `/book/api/eBook/v2/article/${id}/comments`,
    params,
  )
}

// 阅读电子书文章
export function articleRead(id: number) {
  return client.get(`/book/api/eBook/v2/article/${id}/read`, {})
}
