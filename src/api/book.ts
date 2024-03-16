/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-16 20:51:45
 * @FilePath: /geekedu-web/src/api/book.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import client from './internal/httpClient'

// 电子书列表
export function list(params: any) {
  return client.get('/book/api/eBook/v2/book/list', params)
}

// 获取电子书推荐
export function hotList() {
  return client.get('/system/api/v2/eBook/recommend', {})
}

// 获取某电子书明细
export function detail(id: number) {
  return client.get(`/book/api/eBook/v2/book/${id}/detail`, {})
}

// 收藏状态
export function likeStatus(params: any) {
  return client.get(`/book/api/eBook/v2/book/collection/status`, params)
}

// 收藏电子书
export function likeHit(params: any) {
  return client.post(`/book/api/eBook/v2/book/collection/hit`, params)
}

// 获取电子书评论
export function bookComments(id: number, params: any) {
  return client.get(
    `/book/api/eBook/v2/book/${id}/comments`,
    params,
  )
}

// 新增电子书评论
export function submitBookComment(id: number, params: any) {
  return client.post(
    `/book/api/eBook/v2/book/${id}/comment`,
    params,
  )
}

// 文章 一级评论
export function comments(id: number, params: any) {
  return client.get(
    `/book/api/eBook/v2/article/${id}/comments`,
    params,
  )
}

// 文章 新增评论
export function submitComment(id: number, params: any) {
  return client.post(
    `/book/api/eBook/v2/article/${id}/comment`,
    params,
  )
}

// 文章 二级评论
export function answerComments(id: number, params: any) {
  return client.get(
    `/book/api/eBook/v2/article/${id}/comments`,
    params,
  )
}

// 阅读电子书文章
export function articleRead(id: number) {
  return client.get(`/book/api/eBook/v2/article/${id}/read`, {})
}
