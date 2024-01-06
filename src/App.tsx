import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import './App.scss'

interface IProps {
  children?: ReactNode
}

const App: FC<IProps> = () => {
  return <div>App</div>
}

export default memo(App)
