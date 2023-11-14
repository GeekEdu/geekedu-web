import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface IProps {
  children?: ReactNode
}

const Column: FC<IProps> = () => {
  return <div>Column</div>
}

export default memo(Column)
