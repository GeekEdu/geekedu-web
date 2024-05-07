import type { Axios, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { message } from 'antd'
import { clearToken, getToken } from '../../utils/index'

function GoLogin() {
  clearToken()
  window.location.href = '/login'
}

export class HttpClient {
  axios: Axios

  constructor(url: string) {
    this.axios = axios.create({
      baseURL: url,
      timeout: 15000,
      withCredentials: false,
      headers: {
        Accept: 'application/json',
      },
    })

    // 拦截器注册
    this.axios.interceptors.request.use(
      (config) => {
        const token = getToken()
        token && (config.headers.Authorization = `Bearer ${token}`)
        // config.headers.common["meedu-platform"] = "PC";
        return config
      },
      (err) => {
        return Promise.reject(err)
      },
    )

    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        const status = response.data.status // 业务返回代码
        const msg = response.data.message // 错误消息

        if (status === 0) {
          // 请求成功
          return Promise.resolve(response)
        }
        else if (status === 401) {
          message.error('请重新登录')
          GoLogin()
        } else if (status === 500) {
          message.error(msg)
        }
        else if (status.status === 5) {
          console.log('查询中')
        }
        else {
          if (msg !== '请勿重复绑定')
            message.error(msg)
        }
        return Promise.reject(response)
      },
      // 当http的状态码非200
      (error) => {
        const status = error.response.status
        if (status === 401) {
          message.error('请重新登录')
          GoLogin()
        }
        else if (status === 404) {
          // 跳转到404页面
        }
        else if (status === 403) {
          // 跳转到无权限页面
        }
        else if (status === 500) {
          // 跳转到500异常页面
        }
        return Promise.reject(error.response)
      },
    )
  }

  get<T>(url: string, params: object) {
    return this.request<T>({
      method: 'GET',
      url,
      params,
    })
  }

  destroy<T>(url: string) {
    return this.request<T>({
      method: 'DELETE',
      url,
    })
  }

  post<T, K>(url: string, params: K) {
    return this.request<T>({
      method: 'POST',
      url,
      data: params,
    })
  }

  put<T, K>(url: string, params: K) {
    return this.request<T>({
      method: 'PUT',
      url,
      data: params,
    })
  }

  request<T>(config: AxiosRequestConfig<any>) {
    return new Promise<T>((resolve, reject) => {
      this.axios
        .request(config)
        .then((res: AxiosResponse<T>) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err.data)
        })
    })
  }
}

let appUrl = import.meta.env.VITE_APP_WS_URL || ''
if (
  typeof (window as any).meedu_api_ws_url !== 'undefined'
  && (window as any).meedu_api_ws_url
)
  appUrl = (window as any).meedu_api_ws_url

const client = new HttpClient(appUrl)

export default client
