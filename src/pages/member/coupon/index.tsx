import React, { useEffect, useState } from 'react'
import { Col, Pagination, Row, Spin } from 'antd'
import { useDispatch } from 'react-redux'
import { CouponItemPage, Empty, NavMember } from '../../../components'
import styles from './index.module.scss'
import { user } from '../../../api'

export default function CouponPage() {
  document.title = '我的优惠'
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [page, setPage] = useState<any>(1)
  const [size, setSize] = useState<any>(10)
  const [total, setTotal] = useState<any>(0)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    getData()
  }, [page, size, refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    // 请求我的优惠券列表
    user.userCoupons().then((res: any) => {
      console.log(res.data);
      const imgUrl = '../../src/assets/img/member/coupon.png'
      if (res.data != null && res.data.length != 0) {
        const newData = res.data.map((item: any) => ({
          ...item,
          imgUrl,
        }))
        setList(newData)
      }
      setTotal(res.data.length)
      setLoading(false)
    })
  }

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
        <NavMember cid={10} refresh={true}></NavMember>
        <div className={styles['coupon-box']}>
          <div className={styles['btn-title']}>我的优惠</div>
          <div className={styles['coupon-content']}>
            {loading && (
              <Row>
                <div className="float-left d-j-flex mt-50">
                  <Spin size="large" />
                </div>
              </Row>
            )}
            {!loading && list.length === 0 && (
              <Col span={24}>
                <Empty></Empty>
              </Col>
            )}
            {!loading
            && list?.length > 0
            && list?.map((item: any, index: any) => (
              <CouponItemPage
                key={index}
                storeName={item.couponDesc}
                discount={item.couponPrice}
                couponCode={item.couponCode}
                validity={item.expiredTime}
                imgUrl={item.imgUrl}
                isOdd={index % 2 !== 0}
              />
            ))}
            {!loading && list.length > 0 && size < total && (
              <Col
                span={24}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 50,
                  marginBottom: 30,
                }}
              >
                <Pagination
                  onChange={(currentPage) => {
                    setPage(currentPage)
                    window.scrollTo(0, 0)
                  }}
                  pageSize={size}
                  defaultCurrent={page}
                  total={total}
                />
              </Col>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
