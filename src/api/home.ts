/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-18 18:10:10
 * @FilePath: /geekedu-web/src/api/home.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import client from './internal/httpClient'

// 获取最新公告
export function announcement() {
  return client.get(`/system/api/v2/announcement/latest`, {})
}

// 获取公告列表
export function announcementList() {
  return client.get(`/system/api/v2/announcement`, {})
}

// 获取某个公告明细
export function announcementDetail(id: number) {
  return client.get(`/system/api/v2/announcement/${id}`, {})
}

// 获取导航栏信息
export function headerNav() {
  return client.get(`/system/api/v2/navs`, {})
}
