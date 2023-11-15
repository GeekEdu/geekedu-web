import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// import {Provider} from 'react-redux'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

import App from './App.tsx'
import '@/assets/css/reset.css'
import './App.scss'
import AutoScorllTop from './AutoTop.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '@3ca7fa' } }}>
    <BrowserRouter>
      <AutoScorllTop>
        <App />
      </AutoScorllTop>
    </BrowserRouter>
  </ConfigProvider>,
)
