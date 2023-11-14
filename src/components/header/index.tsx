import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

import { HeaderWrapper, HeaderLeftWrapper, HeaderRightWrapper } from './style'
import headerTitles from '@/assets/data/header_titles.json'

interface IProps {
  children?: ReactNode
}

const Header: FC<IProps> = () => {
  return (
    <HeaderWrapper>
      <div className='content'>
        <HeaderLeftWrapper>
          <a href='/' className='logo favicon'>
            GeekEdu
          </a>
          <div className='title-list'>
            {headerTitles.map((item) => {
              return (
                <div className='item' key={item.title}>
                  {item.title}
                </div>
              )
            })}
          </div>
        </HeaderLeftWrapper>
        <HeaderRightWrapper>
          <input type='text' className='search' placeholder='Java/Python/C++' />
          <span className='login'>登录</span>
          <span className='register'>注册</span>
        </HeaderRightWrapper>
      </div>
    </HeaderWrapper>
  )
}

export default memo(Header)
