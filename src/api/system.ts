import client from './internal/httpClient'

export function config() {
  return client.get('/system/api/v2/config', {})
}

export function sendSms(params: any) {
  return client.post('/api/v2/captcha/sms', params)
}

export function imageCaptcha() {
  return client.get('/api/v2/captcha/image', {})
}

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
