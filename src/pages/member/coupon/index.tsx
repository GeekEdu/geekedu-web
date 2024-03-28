import React, { useEffect, useState } from 'react'
import { Col, Pagination, Row, Spin } from 'antd'
import { useDispatch } from 'react-redux'
import { CouponItemPage, Empty, NavMember } from '../../../components'
import { user as member } from '../../../api/index'
import { saveUnread } from '../../../store/user/loginUserSlice'
import { getCommentTime } from '../../../utils/index'
import styles from './index.module.scss'

export default function CouponPage() {
  document.title = '我的优惠'
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [refresh, setRefresh] = useState(false)
  const [mesRefresh, setMesRefresh] = useState(false)

  const data: any = [
    {
      name: '123',
      count: '321',
      code: '456',
      validaty: '654',
      imgUrl: '../../src/assets/img/member/coupon.png',
    },
    {
      name: '123',
      count: '321',
      code: '456',
      validaty: '654',
      imgUrl: '../../src/assets/img/member/coupon.png',
    },
    {
      name: '123',
      count: '321',
      code: '456',
      validaty: '654',
      imgUrl: '../../src/assets/img/member/coupon.png',
    },
    {
      name: '123',
      count: '321',
      code: '456',
      validaty: '654',
      imgUrl: '../../src/assets/img/member/coupon.png',
    },
  ]

  return (
    <div className="container">
      <div className={styles.box}>
        <NavMember cid={10} refresh={mesRefresh}></NavMember>
        <div className={styles['coupon-box']}>
          {
            data.map((item: any, index: any) => (
              <CouponItemPage
                key={index}
                storeName={item.name}
                discount={item.count}
                couponCode={item.code}
                validity={item.validaty}
                imgUrl={item.imgUrl}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}
