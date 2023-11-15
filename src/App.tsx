import React, { Suspense, memo } from 'react'
import type { FC, ReactNode } from 'react'
import { useRoutes } from 'react-router-dom'

import routes from './routes'
import LoadingPage from './views/loding'
import './App.scss'

interface IProps {
  children?: ReactNode
}

const App: FC<IProps> = () => {
  return <Suspense fallback={<LoadingPage />}>{useRoutes(routes)}</Suspense>
}

export default memo(App)
