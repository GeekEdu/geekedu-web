import client from './internal/httpClient'

// 获取最新公告
export function announcement() {
  return client.get(`/system/api/v2/announcement/latest`, {})
}

// 获取公告列表
export function announcementList() {
  return client.get(`/system/api/v2/announcements`, {})
}

// 获取某个公告明细
export function announcementDetail(id: number) {
  return client.get(`/system/api/v2/announcement/${id}`, {})
}

// 获取导航栏信息
export function headerNav() {
  return client.get(`/system/api/v2/navs`, {})
}
