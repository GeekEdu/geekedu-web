import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface IProps {
  children?: ReactNode
}

const Profile: FC<IProps> = () => {
  return <div>Profile</div>
}

export default memo(Profile)
