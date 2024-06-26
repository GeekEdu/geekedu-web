import React, { useEffect, useState } from 'react'
import { Col, Pagination, Row, Spin, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Empty, NavMember } from '../../../components'
import { user as member } from '../../../api/index'
import { changeTime, getToken } from '../../../utils/index'
import styles from './index.module.scss'

function MemberCertsPage() {
  document.title = '我的证书'
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [refresh, setRefresh] = useState(false)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const config = useSelector((state: any) => state.systemConfig.value.config)

  useEffect(() => {
    getData()
  }, [page, size, refresh])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    member.certList({
      pageNum: page,
      pageSize: size,
    }).then((res: any) => {
      setList(res.data.data)
      setTotal(res.data.total)
      setLoading(false)
    })
  }

  const resetData = () => {
    setPage(1)
    setList([])
    setRefresh(!refresh)
  }

  const download = (item: any) => {
    const token = getToken()
    window.open(
      `${config.url}/addons/Cert/api/v1/member/cert/${item.id}/download?token=${token}`,
    )
  }

  return (
    <div className="container">
      <div className={styles.box}>
        <NavMember cid={20} refresh={true}></NavMember>
        <div className={styles['project-box']}>
          <div className={styles['btn-title']}>所有证书</div>
          <div className={styles['project-content']}>
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
            && list.length > 0
            && list.map((item: any) => (
              <div key={item.id} className={styles['project-item']}>
                {item && (
                  <div className={styles['item-thumb']}>
                    <img src={item.templateImage} />
                  </div>
                )}
                <div className={styles['item-info']}>
                  <div className={styles['item-top']}>
                    {item && (
                      <div className={styles['item-name']}>
                        {item.name}
                      </div>
                    )}
                    <div className={styles['item-time']}>
                      {changeTime(item.createdTime)}
                    </div>
                  </div>
                  <div className={styles['item-bottom']}>
                    <div
                      className={styles['item-price']}
                      onClick={() => download(item)}
                    >
                      下载证书
                    </div>
                  </div>
                </div>
              </div>
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

export default MemberCertsPage
