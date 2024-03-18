/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-18 18:29:08
 * @FilePath: /geekedu-web/src/api/path.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import client from './internal/httpClient'

// 学习路径列表
export function list(params: any) {
  return client.get('/book/api/path/v2/list', params)
}

// 学习路径分类
export function create(params: any) {
  return client.get('/label/api/category/getCategoryList?type=LEARN_PATH', params)
}

// 学习路径详情
export function detail(id: number) {
  return client.get(`/book/api/path/v2/${id}/detail`, {})
}
