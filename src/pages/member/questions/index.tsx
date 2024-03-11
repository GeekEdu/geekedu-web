import React, { useEffect, useState } from 'react'
import { Col, Pagination, Row, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Empty, NavMember } from '../../../components'
import { user as member } from '../../../api/index'
import styles from './index.module.scss'

function MemberQuestionsPage() {
  document.title = '我的问答'
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [refresh, setRefresh] = useState(false)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [currentTab, setCurrentTab] = useState(1)
  const tabs = [
    {
      name: '我的问题',
      id: 1,
    },
    {
      name: '我的回答',
      id: 2,
    },
  ]

  useEffect(() => {
    if (currentTab == 1)
      getData()
    else if (currentTab === 2)
      getMyAnswers()
  }, [page, size, refresh, currentTab])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    member.userQuestions({ pageNum: page, pageSize: size }).then((res: any) => {
      setList(res.data.data)
      setTotal(res.data.total)
      setLoading(false)
    })
  }

  const getMyAnswers = () => {
    if (loading)
      return

    setLoading(true)
    member.userAnswers({ pageNum: page, pageSize: size }).then((res: any) => {
      setList(res.data.data)
      setTotal(res.data.total)
      setLoading(false)
    })
  }

  const goDetail = (id: number) => {
    navigate(`/wenda/detail/${id}`)
  }

  const resetData = () => {
    setPage(1)
    setList([])
    setRefresh(!refresh)
  }

  const tabChange = (id: number) => {
    if (loading)
      return

    setCurrentTab(id)
    resetData()
  }

  return (
    <div className="container">
      <div className={styles.box}>
        <NavMember cid={13} refresh={true}></NavMember>
        <div className={styles['project-box']}>
          <div className="member-tabs">
            {tabs.map((item: any) => (
              <div
                key={item.id}
                className={
                  currentTab === item.id ? 'active item-tab' : 'item-tab'
                }
                onClick={() => tabChange(item.id)}
              >
                {item.name}
                {currentTab === item.id && <div className="actline"></div>}
              </div>
            ))}
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
            <>
              {currentTab === 1
              && list.map((item: any) => (
                <div
                  key={item.id}
                  className={styles['paper-item-comp']}
                  onClick={() => goDetail(item.id)}
                >
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.info}>
                    {!item.questionStatus && <span>未解决</span>}
                    {item.questionStatus && (
                      <span className={styles.green}>已解决</span>
                    )}
                    <span className={styles.item}>|</span>
                    <span>
                      {item.answerCount}
                      {' '}
                      回答
                    </span>
                  </div>
                </div>
              ))}
              {currentTab === 2
              && list.map((item: any) => (
                <div
                  key={item.id}
                  className={styles['paper-item-comp']}
                  onClick={() => goDetail(item.questionId)}
                >
                  <div
                    className={styles.title}
                    dangerouslySetInnerHTML={{
                      __html:
                          item.content.length > 51
                            ? `${item.content.slice(0, 51)}...`
                            : item.content,
                    }}
                  >
                  </div>
                  <div className={styles.info}>
                    {item.status === 0 && <span>未解决</span>}
                    {item.isCorrect && (
                      <>
                        <span className={styles.green}>被采纳</span>
                        <span className={styles.item}>|</span>
                      </>
                    )}
                    <span>
                      积分+
                      {item.thumbCount}
                    </span>
                  </div>
                </div>
              ))}
            </>
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
              />
            </Col>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemberQuestionsPage
