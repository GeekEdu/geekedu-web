import client from './internal/httpClient'

// 会员套餐列表
export function list() {
  return client.get('/user/api/member/vip/list', {})
}
