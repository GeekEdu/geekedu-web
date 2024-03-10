import client from './internal/httpClient'

// 返回问题列表
export function list(params: any) {
  return client.get('/ask/api/question/v2/list', params)
}

// 返回问题分类列表
export function create() {
  return client.get('/ask/api/question/v2/category/list', {})
}

// 返回问题明细
export function detail(id: number) {
  return client.get(`/ask/api/question/v2/detail/${id}`, {})
}

// 返回配置公告信息
export function config() {
  return client.get('/system/api/v2/ask/config', {})
}

// 新建问题
export function store(params: any) {
  return client.post('/ask/api/question/v2/add', params)
}

export function edit(id: number) {
  return client.get(`/addons/Wenda/api/v1/question/${id}/edit`, {})
}

export function update(id: number, params: any) {
  return client.put(`/addons/Wenda/api/v1/question/${id}/edit`, params)
}

export function choiceAnswer(id: number, params: any) {
  return client.post(
    `/addons/Wenda/api/v1/question/${id}/correct`,
    params,
  )
}

// 回答某个问题
export function submitAnswer(id: number, params: any) {
  return client.post(`/ask/api/question/v2/${id}/answer`, params)
}

// 给 答案点赞
export function vote(params: any) {
  return client.post('/ask/api/answer/v2/thumb', params)
}

// 某个回答的评论列表
export function answerComments(id: number, params: any) {
  return client.get(
    `/ask/api/answer/v2/${id}/comments`,
    params,
  )
}

// 评论某个回答
export function submitComment(id: number, params: any) {
  return client.post(
    `/ask/api/answer/v2/${id}/comment`,
    params,
  )
}
