import client from './internal/httpClient'

// 获取系统配置信息
export function config() {
  return client.get('/system/api/v2/config', {})
}

export function sendSms(params: any) {
  return client.post('/api/v2/captcha/sms', params)
}

// 获取图形验证码
export function imageCaptcha() {
  return client.get('/user/api/captcha/image', {})
}

// 获取链接信息 底部友情链接
export function footerLink() {
  return client.get(`/system/api/v2/links`, {})
}

export function historyRecord(type: string, id: number, title: string) {
  return client.post('/addons/templateOne/api/v1/history/record', {
    type,
    id,
    title,
  })
}
