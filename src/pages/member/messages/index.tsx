import React, { useEffect, useState } from 'react'
import { Col, Pagination, Row, Spin } from 'antd'
import { useDispatch } from 'react-redux'
import { Empty, NavMember } from '../../../components'
import { user as member } from '../../../api/index'
import { saveUnread } from '../../../store/user/loginUserSlice'
import { getCommentTime } from '../../../utils/index'
import styles from './index.module.scss'

function MemberMessagesPage() {
  document.title = '我的消息'
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [refresh, setRefresh] = useState(false)
  const [mesRefresh, setMesRefresh] = useState(false)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(20)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    getList()
  }, [page, size, refresh])

  const resetList = () => {
    setPage(1)
    setList([])
    setRefresh(!refresh)
  }

  const getList = () => {
    if (loading)
      return

    setLoading(true)
    member
      .messages({
        pageNum: page,
        pageSize: size,
      })
      .then((res: any) => {
        setList(res.data.data)
        setTotal(res.data.total)
        setLoading(false)
      })
  }

  const readAll = () => {
    member.readMessageAll().then(() => {
      getList()
      setMesRefresh(!mesRefresh)
      dispatch(saveUnread(false))
    })
  }

  const read = (item: any, index: number) => {
    if (item.readTime)
      return

    member.readMessage(item.id).then(() => {
      const arr = [...list]
      arr[index].isRead = true
      setList(arr)
      setMesRefresh(!mesRefresh)
    })
  }

  return (
    <div className="container">
      <div className={styles.box}>
        <NavMember cid={7} refresh={mesRefresh}></NavMember>
        <div className={styles['messages-box']}>
          <div className={styles['btn-top']}>
            <div className={styles['btn-title']}>我的消息</div>
            <div className={styles['btn-read']} onClick={() => readAll()}>
              全部已读
            </div>
          </div>

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
          {!loading && list.length > 0 && (
            <div className={styles['messages-content']}>
              {list.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className={
                    item?.isRead
                      ? styles['message-item']
                      : styles['message-item-readed']
                  }
                  onClick={() => read(item, index)}
                >
                  {!item?.isRead && <div className={styles.point}></div>}
                  <div className={styles.cont}>{item.message}</div>
                  <div className={styles.date}>
                    {getCommentTime(item.createdTime)}
                  </div>
                </div>
              ))}
            </div>
          )}
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
                showSizeChanger={false}
              />
            </Col>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemberMessagesPage
