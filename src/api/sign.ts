/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-12 15:45:12
 * @FilePath: /geekedu-web/src/api/sign.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import client from './internal/httpClient'

// 是否签到
export function user() {
  return client.get('/user/api/v2/isSign', {})
}

// 签到
export function signIn() {
  return client.post('/user/api/v2/sign', {})
}
