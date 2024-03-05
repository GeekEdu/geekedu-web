import client from './internal/httpClient'

// 录播课列表 分页
export function list(params: any) {
  return client.get('/course/api/v2/courses', params)
}

// 录播课详情
export function detail(id: number) {
  return client.get(`/course/api/v2/detail/${id}`, {})
}

// 课程评论列表
export function comments(id: number) {
  return client.get(`/course/api/v2/${id}/comments`, {})
}

export function collect(id: number) {
  return client.get(`/api/v2/course/${id}/like`, {})
}

// 提交课程评论
export function submitComment(id: number, params: any) {
  return client.post(`/course/api/v2/${id}/comment`, params)
}

// 课时明细
export function video(id: number) {
  return client.get(`/course/api/v2/section/detail/${id}`, {})
}

// 课时评论
export function videoComments(id: number) {
  return client.get(`/course/api/v2/section/${id}/comments`, {})
}

// 提交课时评论
export function submitVideoComment(id: number, params: any) {
  return client.post(`/course/api/v2/section/${id}/comment`, params)
}

// 获取播放地址
export function playInfo(id: number, params: any) {
  return client.get(`/course/api/v2/section/${id}/playUrl`, params)
}

// 记录学员观看时长
export function videoRecord(id: number, params: any) {
  return client.post(`/api/v2/video/${id}/record`, params)
}

// 获取录播课分类列表
export function categories() {
  return client.get('/course/api/v2/category/list', {})
}
export function download(id: number, params: any) {
  return client.get(`/api/v2/course/attach/${id}/download`, params)
}
