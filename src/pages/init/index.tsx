import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { Spin } from 'antd'
import { loginAction } from '../../store/user/loginUserSlice'
import {
  saveConfigAction,
  saveConfigFuncAction,
} from '../../store/system/systemConfigSlice'
import { saveNavsAction } from '../../store/nav-menu/navMenuConfigSlice'
import { BackTop, CodeLoginBindMobileDialog } from '../../components'
import { login, share, user } from '../../api'
import {
  SPAUrlAppend,
  clearBindMobileKey,
  clearFaceCheckKey,
  clearMsv,
  getMsv,
  getSessionLoginCode,
  getToken,
  isMobile,
  saveLoginCode,
  saveMsv,
  saveSessionLoginCode,
  setBindMobileKey,
  setFaceCheckKey,
  setToken,
} from '../../utils/index'

interface Props {
  config: any
  configFunc: any
  navsData: any
}

export function InitPage(props: Props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // ------ store变量 ------
  const isLogin = useSelector((state: any) => state.loginUser.value.isLogin)

  // ------ URL变量 ------
  const [searchParams] = useSearchParams()
  const urlMsv = searchParams.get('msv')
  const urlLoginCode = searchParams.get('login_code')
  const urlAction = searchParams.get('action')
  const urlRedirectUrl = decodeURIComponent(
    searchParams.get('redirect') || '/',
  )

  // ------ 本地变量 ------
  const loginToken = getToken()
  const [backTopStatus, setBackTopStatus] = useState(false)
  const [codebindmobileVisible, setCodebindmobileVisible] = useState(false)

  // 滚动条监听
  useEffect(() => {
    const getHeight = () => {
      const scrollTop
        = document.documentElement.scrollTop || document.body.scrollTop
      setBackTopStatus(scrollTop >= 2000)
    }
    window.addEventListener('scroll', getHeight, true)
    return () => {
      window.removeEventListener('scroll', getHeight, true)
    }
  }, [])

  // msv(分销识别符)的保存
  useEffect(() => {
    urlMsv && saveMsv(urlMsv)
  }, [urlMsv])

  useEffect(() => {
    if (urlLoginCode && urlAction === 'login')
      codeLogin(urlLoginCode, urlRedirectUrl)
  }, [urlLoginCode, urlAction, urlRedirectUrl])

  // 使用code登录系统
  const codeLogin = (code: string, redirectUrl: string) => {
    // 防止code重复请求登录
    if (getSessionLoginCode(code))
      return

    saveSessionLoginCode(code)
    // 请求登录接口
    login.codeLogin({ code, msv: getMsv() }).then((res: any) => {
      if (res.data.success === 1) {
        setToken(res.data.token)
        user.detail().then((res: any) => {
          const loginData = res.data
          // 将学员数据存储到store
          dispatch(loginAction(loginData))
          // 登录成功之后的跳转
          if (window.location.pathname === '/login/callback') {
            // 社交登录回调指定的跳转地址
            navigate(redirectUrl, { replace: true })
          }
          else {
            // 直接reload当前登录表单所在页面
            const path = window.location.pathname + window.location.search
            navigate(path, { replace: true })
          }
        })
      }
      else {
        if (res.data.action === 'bind_mobile') {
          saveLoginCode(code)
          setCodebindmobileVisible(true)
        }
      }
    })
  }

  const msvBind = () => {
    const msv = getMsv()
    if (!msv)
      return

    share
      .bind({ msv })
      .catch((e: any) => {
        console.error(`三级分销绑定失败,错误信息:${JSON.stringify(e)}`)
      })
      .finally(() => {
        clearMsv()
      })
  }

  useEffect(() => {
    // 存在token-做自动登录
    loginToken
    && user
      .detail()
      .then((res: any) => {
        const resUser = res.data as UserDetailInterface
        // 强制绑定手机号
        if (
          resUser.is_bind_mobile === 0
          && props.config.member.enabled_mobile_bind_alert === 1
        )
          setBindMobileKey()
        else
          clearBindMobileKey()

        // 强制实名认证
        if (
          resUser.is_face_verify === false
          && props.config.member.enabled_face_verify === true
        )
          setFaceCheckKey()
        else
          clearFaceCheckKey()

        // 自动登录
        dispatch(loginAction(resUser))

        msvBind()
      })
      .catch((e) => {})
  }, [loginToken])

  if (props.config) {
    dispatch(saveConfigAction(props.config))

    // 手机设备访问PC站点 && 配置了H5站点的地址
    if (isMobile() && props.config.h5_url) {
      let url = props.config.h5_url
      const curPathname = window.location.pathname
      const curSearch = window.location.search || ''

      if (curPathname.includes('/topic/detail')) {
        const id = curPathname.slice(14)
        if (curSearch === '') {
          url += `/#/pages/webview/webview?course_type=topic&id=${id}`
        }
        else {
          url
            += `/#/pages/webview/webview${
             curSearch
             }&course_type=topic&id=${
             id}`
        }
      }
      else if (curPathname.includes('/courses/detail')) {
        const id = curPathname.slice(16)
        if (curSearch === '')
          url += `/#/pages/course/show?id=${id}`
        else
          url += `/#/pages/course/show${curSearch}&id=${id}`
      }
      else if (curPathname.includes('/courses/video')) {
        const id = curPathname.slice(15)
        if (curSearch === '')
          url += `/#/pages/course/video?id=${id}`
        else
          url += `/#/pages/course/video${curSearch}&id=${id}`
      }
      else if (curPathname.includes('/live/detail')) {
        const id = curPathname.slice(13)
        if (curSearch === '')
          url += `/#/packageA/live/show?id=${id}`
        else
          url += `/#/packageA/live/show${curSearch}&id=${id}`
      }
      else if (curPathname.includes('/live/video')) {
        const id = curPathname.slice(12)
        if (curSearch === '')
          url += `/#/packageA/live/video?id=${id}`
        else
          url += `/#/packageA/live/video${curSearch}&id=${id}`
      }
      else if (curPathname.includes('/book/detail')) {
        const id = curPathname.slice(13)
        if (curSearch === '')
          url += `/#/packageA/book/show?id=${id}`
        else
          url += `/#/packageA/book/show${curSearch}&id=${id}`
      }
      else if (curPathname.includes('/book/read')) {
        const id = curPathname.slice(11)
        if (curSearch === '') {
          url += `/#/pages/webview/webview?course_type=book&id=${id}`
        }
        else {
          url
            += `/#/pages/webview/webview${
             curSearch
             }&course_type=book&id=${
             id}`
        }
      }
      else if (curPathname.includes('/learnPath/detail')) {
        const id = curPathname.slice(18)
        if (curSearch === '')
          url += `/#/packageA/learnPath/show?id=${id}`
        else
          url += `/#/packageA/learnPath/show${curSearch}&id=${id}`
      }
      else if (curPathname.includes('/exam/papers/detail')) {
        const id = curPathname.slice(20)
        if (curSearch === '') {
          url += `/#/pages/webview/webview?course_type=paperRead&id=${id}`
        }
        else {
          url
            += `/#/pages/webview/webview${
             curSearch
             }&course_type=paperRead&id=${
             id}`
        }
      }
      else if (curPathname.includes('/exam/practice/detail')) {
        const id = curPathname.slice(22)
        if (curSearch === '') {
          url += `/#/pages/webview/webview?course_type=practiceRead&id=${id}`
        }
        else {
          url
            += `/#/pages/webview/webview${
             curSearch
             }&course_type=practiceRead&id=${
             id}`
        }
      }
      else if (curPathname.includes('/exam/mockpaper/detail')) {
        const id = curPathname.slice(23)
        if (curSearch === '') {
          url += `/#/pages/webview/webview?course_type=mockRead&id=${id}`
        }
        else {
          url
            += `/#/pages/webview/webview${
             curSearch
             }&course_type=mockRead&id=${
             id}`
        }
      }

      // 如果存在msv的话则携带上msv(邀请学员的id)
      if (urlMsv)
        url = SPAUrlAppend(props.config.h5_url, `msv=${urlMsv}`)

      // 跳转到手机访问地址
      window.location.href = url
    }
  }

  if (props.configFunc)
    dispatch(saveConfigFuncAction(props.configFunc))

  if (props.navsData)
    dispatch(saveNavsAction(props.navsData))

  if (loginToken && isLogin === false) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    )
  }

  return (
    <>
      <CodeLoginBindMobileDialog
        scene="mobile_bind"
        open={codebindmobileVisible}
        onCancel={() => setCodebindmobileVisible(false)}
        success={() => {
          setCodebindmobileVisible(false)
        }}
      />

      <div style={{ minHeight: 800 }}>
        <Outlet />
      </div>

      {backTopStatus ? <BackTop></BackTop> : null}
    </>
  )
}
