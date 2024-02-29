import client from './internal/httpClient'

// 获取首页布局信息
export function pageBlocks(params: any) {
  return client.get('/api/v2/viewBlock/page/blocks', params)
}

// 获取走马灯 轮播图信息
export function sliders(params: any) {
  return client.get('/system/api/v2/sliders', params)
}
