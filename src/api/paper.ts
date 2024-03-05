import client from './internal/httpClient'

// 在线考试列表
export function list(params: any) {
  return client.get('/exam/api/v2/paper/list', params)
}

export function paperDetail(id: number) {
  return client.get(`/addons/Paper/api/v1/paper/${id}`, {})
}

export function createPaperOrder(id: number, params: any) {
  return client.post('/addons/Paper/api/v1/paper/buy', params)
}

export function paperJoin(id: number) {
  return client.get(`/addons/Paper/api/v1/paper/${id}/join`, {})
}

export function paperJoinRecord(paperId: number, recordId: number) {
  return client.get(
    `/addons/Paper/api/v1/paper/${paperId}/join/${recordId}`,
    {},
  )
}

export function paperJoinRecords(id: number, params: any) {
  return client.get(
    `/addons/Paper/api/v1/paper/${id}/joinRecords`,
    params,
  )
}

export function paperSubmitSingle(id: number, params: any) {
  return client.post(
    `/addons/Paper/api/v1/paper/${id}/submit/single`,
    params,
  )
}

export function paperSubmit(id: number, params: any) {
  return client.post(
    `/addons/Paper/api/v1/paper/${id}/submit/all`,
    params,
  )
}
