import moment from 'moment'

declare const window: any

export function getToken(): string {
  return window.localStorage.getItem('geekedu-user-token') || ''
}

export function setToken(token: string) {
  window.localStorage.setItem('geekedu-user-token', token)
}

export function clearToken() {
  window.localStorage.removeItem('geekedu-user-token')
}

export function getPlayId(): string {
  return window.localStorage.getItem('geekedu-play-id') || ''
}

export function savePlayId(id: string) {
  window.localStorage.setItem('geekedu-play-id', id)
}

export function clearPlayId() {
  window.localStorage.removeItem('geekedu-play-id')
}

export function getMsv(): string {
  return window.localStorage.getItem('geekedu-msv') || ''
}

export function saveMsv(msv: string) {
  window.localStorage.setItem('geekedu-msv', msv)
}

export function clearMsv() {
  window.localStorage.removeItem('geekedu-msv')
}

export function saveLoginCode(code: string) {
  window.localStorage.setItem('login_code', code)
}

export function getLoginCode() {
  return window.localStorage.getItem('login_code')
}

export function clearLoginCode() {
  window.localStorage.removeItem('login_code')
}

export function saveSessionLoginCode(code: string) {
  if (!code)
    return

  window.sessionStorage.setItem(`login_code:${code}`, code)
}

export function getSessionLoginCode(code: string) {
  return window.sessionStorage.getItem(`login_code:${code}`)
}

export function clearSessionLoginCode(code: string) {
  return window.sessionStorage.removeItem(`login_code:${code}`)
}

export function getCommentTime(dateStr: string) {
  if (dateStr === '刚刚')
    return '刚刚'

  const interval = moment().diff(moment(dateStr), 'seconds')
  if (interval < 60) {
    return '刚刚'
  }
  else if (interval < 60 * 60) {
    const tempTime = Math.floor(interval / 60)
    return `${tempTime}分钟前`
  }
  else if (interval < 60 * 60 * 24) {
    const tempTime = Math.floor(interval / (60 * 60))
    return `${tempTime}小时前`
  }
  else if (interval < 60 * 60 * 24 * 7) {
    const tempTime = Math.floor(interval / (60 * 60 * 24))
    return `${tempTime}天前`
  }
  else if (interval < 60 * 60 * 24 * 365) {
    return moment(dateStr).utcOffset(0).format('MM-DD:ss')
  }
  else {
    return moment(dateStr).utcOffset(0).format('YYYY-MM-DD:ss')
  }
}

export function changeTime(dateStr: string) {
  const interval = moment().diff(moment(dateStr), 'seconds')
  if (interval < 60) {
    return '刚刚'
  }
  else if (interval < 60 * 60) {
    const tempTime = Math.floor(interval / 60)
    return `${tempTime}分钟前`
  }
  else if (interval < 60 * 60 * 24) {
    const tempTime = Math.floor(interval / (60 * 60))
    return `${tempTime}小时前`
  }
  else if (interval < 60 * 60 * 24 * 7) {
    const tempTime = Math.floor(interval / (60 * 60 * 24))
    return `${tempTime}天前`
  }
  else if (interval < 60 * 60 * 24 * 365) {
    return moment(dateStr).utcOffset(0).format('MM-DD HH:mm:ss')
  }
  else {
    return moment(dateStr).utcOffset(0).format('YYYY-MM-DD HH:mm:ss')
  }
}

export function dateFormat(dateStr: string) {
  return moment(dateStr).format('YYYY-MM-DD HH:mm:ss')
}

export function generateUUID(): string {
  let guid = ''
  for (let i = 1; i <= 32; i++) {
    const n = Math.floor(Math.random() * 16.0).toString(16)
    guid += n
    if (i === 8 || i === 12 || i === 16 || i === 20)
      guid += '-'
  }
  return guid
}

export function transformBase64ToBlob(
  base64: string,
  mime: string,
  filename: string,
): File {
  const arr = base64.split(',')
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--)
    u8arr[n] = bstr.charCodeAt(n)

  return new File([u8arr], filename, { type: mime })
}

export function getHost() {
  return `${window.location.protocol}//${window.location.host}/`
}

export function inStrArray(array: string[], value: string): boolean {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value)
      return true
  }
  return false
}

export function getAppUrl() {
  let host = `${window.location.protocol}//${window.location.host}`
  const pathname = window.location.pathname
  if (pathname && pathname !== '/')
    host += pathname

  return host
}

export function random(minNum: number, maxNum: number) {
  switch (arguments.length) {
    case 1:
      return Math.random() * minNum + 1, 10
    case 2:
      return Math.random() * (maxNum - minNum + 1) + minNum, 10
    default:
      return 0
  }
}

export function getShareHost() {
  let hash = window.location.hash

  if (hash.match('#'))
    hash = '/#/'
  else
    hash = '/'

  const host = `${window.location.protocol}//${window.location.host}${hash}`
  return host
}

export function isMobile() {
  const flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  )
  return flag
}

export function SPAUrlAppend(baseUrl: string, queryParams: any) {
  const parseBaseUrl = new URL(baseUrl)
  return (
    `${parseBaseUrl.protocol
    }//${
    parseBaseUrl.host
    }${parseBaseUrl.pathname
    }#/?${
    parseBaseUrl.search ? `${parseBaseUrl.search}&` : ''
    }${queryParams}`
  )
}

export function codeRender(el: any) {
  if (!el)
    return

  const blocks = el.querySelectorAll('pre') || el.querySelectorAll('code')
  blocks.forEach((block: any) => {
    window.hljs.highlightBlock(block)
  })
  return el
}

export function latexRender(el: any) {
  if (!el)
    return

  const reg1 = new RegExp('&nbsp;', 'g')
  const reg2 = new RegExp('&amp;', 'g')
  const reg3 = new RegExp('nbsp;', 'g')
  const reg4 = new RegExp('amp;', 'g')
  el.innerHTML = el.innerHTML.replace(reg1, '')
  el.innerHTML = el.innerHTML.replace(reg2, '&')
  el.innerHTML = el.innerHTML.replace(reg3, '')
  el.innerHTML = el.innerHTML.replace(reg4, '')
  window.renderMathInElement(el, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\(', right: '\\)', display: false },
      { left: '\\[', right: '\\]', display: true },
    ],
    macros: {
      '\\ge': '\\geqslant',
      '\\le': '\\leqslant',
      '\\geq': '\\geqslant',
      '\\leq': '\\leqslant',
    },
    options: {
      skipHtmlTags: ['noscript', 'style', 'textarea', 'pre', 'code'],
      // 跳过mathjax处理的元素的类名，任何元素指定一个类 tex2jax_ignore 将被跳过，多个累=类名'class1|class2'
      ignoreHtmlClass: 'tex2jax_ignore',
    },
    svg: {
      fontCache: 'global',
    },
    throwOnError: false,
  })

  return el
}

export function getBindMobileKey(): string {
  return window.localStorage.getItem('geekedu-bind-mobile') || ''
}

export function setBindMobileKey() {
  window.localStorage.setItem('geekedu-bind-mobile', 'ok')
}

export function clearBindMobileKey() {
  window.localStorage.removeItem('geekedu-bind-mobile')
}

export function getFaceCheckKey(): string {
  return window.localStorage.getItem('geekedu-face-check') || ''
}

export function setFaceCheckKey() {
  window.localStorage.setItem('geekedu-face-check', 'ok')
}

export function clearFaceCheckKey() {
  window.localStorage.removeItem('geekedu-face-check')
}
