import client from './internal/httpClient'

// 在学课程
export function courses(params: any) {
  return client.get('/course/api/v2/learnedCourse', params)
}

// 学习进度详情
export function coursesDetail(courseId: number, params: any) {
  return client.get(`/course/api/v2/${courseId}/learnedDetail`, params)
}

// 在学直播课
export function live(params: any) {
  return client.get('/addons/zhibo/api/v1/member/courses/learned', params)
}

// 收藏直播课
export function liveLikeCourses(params: any) {
  return client.get('/user/api/member/topic/collect/list', params)
}

// 在学图文
export function topic() {
  return client.get('/book/api/imageText/v2/study/list', {})
}

// 在学电子书
export function book() {
  return client.get('/book/api/eBook/v2/study/list', {})
}

// 收藏电子书
export function bookLikeCourses(params: any) {
  return client.get('/user/api/member/topic/collect/list', params)
}

// 收藏图文
export function topicLikeCourses(params: any) {
  return client.get('/user/api/member/topic/collect/list', params)
}
