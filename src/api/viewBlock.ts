/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-18 19:48:06
 * @FilePath: /geekedu-web/src/api/viewBlock.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import client from './internal/httpClient'

// 获取首页布局信息
export function pageBlocks() {
  return client.get('/system/api/index/v2/block', {})
}

// 获取走马灯 轮播图信息
export function sliders(params: any) {
  return client.get('/system/api/v2/sliders', params)
}
