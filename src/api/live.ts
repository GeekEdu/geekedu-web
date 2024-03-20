/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-20 16:51:13
 * @FilePath: /geekedu-web/src/api/live.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import client from './internal/httpClient'

// 直播课列表
export function list(params: any) {
  return client.get('/course/api/live/course/v2/list', params)
}

// 直播课详情
export function detail(id: number) {
  return client.get(`/course/api/live/course/v2/${id}/detail`, {})
}

// 直播课评论
export function comments(id: number, params: any) {
  return client.get(`/course/api/live/course/v2/${id}/comments`, params)
}

// 评论课程
export function submitComment(id: number, params: any) {
  return client.post(`/course/api/live/course/v2/${id}/comment`, params)
}

// export function play(id: number) {
//   return client.get(`/addons/zhibo/api/v1/course/${id}/play`, {})
// }
export function play(id: number) {
  return client.get(`/course/api/live/v2/${id}/play`, {})
}

// 直播观看记录
export function liveWatchRecord(
  courseId: number,
  videoId: number,
  params: any,
) {
  return client.post(
    `/course/api/live/course/${courseId}/video/${videoId}/liveWatchRecord`,
    params,
  )
}

// 发送聊天消息
export function chatMsgSend(courseId: number, videoId: number, params: any) {
  return client.post(
    `/ws/api/chat/course/${courseId}/video/${videoId}/chat/send`,
    params,
  )
}

// 聊天记录
export function chatMsgPaginate(
  courseId: number,
  videoId: number,
  params: any,
) {
  return client.get(
    `/course/api/live/course/${courseId}/video/${videoId}/chat/msg`,
    params,
  )
}

export function attachList(course_id: number, video_id: number, params: any) {
  return client.get(
    `/addons/zhibo/api/v1/course/${course_id}/video/${video_id}/attach/index`,
    params,
  )
}

export function record(course_id: number, video_id: number, params: any) {
  return client.get(
    `/addons/zhibo/api/v1/course/${course_id}/video/${video_id}/watch/record`,
    params,
  )
}

export function createOrder(id: number, params: any) {
  return client.post(`/addons/zhibo/api/v1/course/${id}/paid`, params)
}

export function user(params: any) {
  return client.get('/addons/zhibo/api/v1/member/courses', params)
}

export function chatRecords(course_id: number, video_id: number, params: any) {
  return client.get(
    `/addons/zhibo/api/v1/course/${course_id}/video/${video_id}/chat/records`,
    params,
  )
}

export function sendMessage(course_id: number, video_id: number, params: any) {
  return client.get(
    `/addons/zhibo/api/v1/course/${course_id}/video/${video_id}/chat/send`,
    params,
  )
}

// export function likeStatus(params: any) {
//   return client.get(`/addons/templateOne/api/v1/like/status`, params)
// }

// 收藏课程
export function likeHit(id: number) {
  return client.post(`/course/api/live/course/v2/${id}/collect`, {})
}
