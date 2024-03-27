/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-27 14:32:10
 * @FilePath: /geekedu-web/src/api/miaosha.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import client from './internal/httpClient'

export function list(params: any) {
  return client.get('/addons/MiaoSha/api/v1/m', params)
}

// 秒杀详情
export function detail(params: any) {
  return client.get(`/trade/api/seckill/v2/detail`, params)
}

// 开始秒杀
export function join(id: number, params: any) {
  return client.post(`/trade/api/seckill/v2/${id}/start`, params)
}
export function createOrder(id: number, params: any) {
  return client.post(`/addons/MiaoSha/api/v1/m/order/${id}/buy`, params)
}
