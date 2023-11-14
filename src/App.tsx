import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { useRoutes } from 'react-router-dom'

import Header from './components/header'
import routes from './routes'
import Footer from './components/footer'

interface IProps {
  children?: ReactNode
}

const App: FC<IProps> = () => {
  return (
    <>
      <Header />
      <div className='main'>{useRoutes(routes)}</div>
      <Footer />
    </>
  )
}

export default memo(App)
