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

export function submitAnswer(id: number, params: any) {
  return client.post(`/addons/Wenda/api/v1/question/${id}/answer`, params)
}

export function vote(params: any) {
  return client.post('/addons/Wenda/api/v1/vote', params)
}

export function answerComments(id: number, params: any) {
  return client.get(
    `/addons/Wenda/api/v1/question/answer/${id}/comments`,
    params,
  )
}

export function submitComment(id: number, params: any) {
  return client.post(
    `/addons/Wenda/api/v1/question/answer/${id}/comment`,
    params,
  )
}
