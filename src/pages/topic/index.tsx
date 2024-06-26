import { useEffect, useState } from 'react'
import { Col, Pagination, Row, Skeleton } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { topic } from '../../api/index'
import {
  Empty,
  FilterCategories,
  ThumbBar,
  TopicCourseItem,
} from '../../components'
import styles from './index.module.scss'
import { useSelector } from 'react-redux'

function TopicPage() {
  document.title = '图文'
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [categories, setCategories] = useState<any>([])
  const [hotList, setHotList] = useState<any>([])
  const [refresh, setRefresh] = useState(false)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const result = new URLSearchParams(useLocation().search)
  const [cid, setCid] = useState(Number(result.get('category_id')) || 0)
  const user = useSelector((state: any) => state.loginUser.value.user)

  useEffect(() => {
    getList()
  }, [refresh, page, size])

  useEffect(() => {
    if (user !== null) {
      getHotData()
    }
  }, [user])

  const resetList = () => {
    setPage(1)
    setList([])
    setRefresh(!refresh)
  }

  const getList = () => {
    if (loading)
      return

    setLoading(true)
    topic
      .list({
        pageNum: page,
        pageSize: size,
        scene: 'default',
        categoryId: cid,
      })
      .then((res: any) => {
        setList(res.data.data.data)
        setTotal(res.data.data.total)
        setCategories(res.data.categories)
        setLoading(false)
      })
  }

  const getHotData = () => {
    if (loading2)
      return

    setLoading2(true)
    topic.hotList({userId: user.id}).then((res: any) => {
      setHotList(res.data)
      setLoading2(false)
    })
  }

  const goDetail = (id: number) => {
    navigate(`/topic/detail/${id}`)
  }

  return (
    <>
      <FilterCategories
        loading={loading}
        categories={categories}
        defaultKey={cid}
        defaultChild={0}
        onSelected={(id: number, child: number) => {
          setCid(id)
          if (id === 0)
            navigate('/topic')
          else
            navigate(`/topic?category_id=${id}`)

          resetList()
        }}
      />
      <div className={styles.container}>
        <div className={styles['left-contanier']}>
          {loading && (
            <Row>
              <div
                style={{
                  width: 769,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 769,
                      display: 'flex',
                      flexDirection: 'row',
                      padding: '20px 30px',
                      boxSizing: 'border-box',
                      marginBottom: 10,
                    }}
                  >
                    <Skeleton.Button
                      active
                      style={{
                        width: 133,
                        height: 100,
                        borderRadius: 8,
                        marginRight: 20,
                      }}
                    >
                    </Skeleton.Button>
                    <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
                  </div>
                ))}
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
            <TopicCourseItem
              key={item.id}
              cid={item.id}
              thumb={item.coverLink}
              viewTimes={item.readCount}
              category={item.category.name}
              title={item.title}
              charge={item.price}
              isVipFree={item.isVipFree}
              isNeedLogin={item?.is_need_login}
              thumbCount={item.thumbCount}
              collectCount={item.collectCount}
              commentCount={item?.commentCount}
            >
            </TopicCourseItem>
          ))}
          {!loading && list.length > 0 && size < total && (
            <Col
              span={24}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 50,
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
          <div className={styles['right-contanier']}>
          <div className={styles['right-list']}>
            <div className={styles.tit}>推荐阅读</div>
            {loading2 && (
              <Row>
                <div
                  style={{
                    width: 400,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      width: 400,
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: 30,
                      boxSizing: 'border-box',
                    }}
                  >
                    <Skeleton.Button
                      active
                      style={{
                        width: 133,
                        height: 100,
                        borderRadius: 8,
                        marginRight: 20,
                      }}
                    >
                    </Skeleton.Button>
                    <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
                  </div>
                  <div
                    style={{
                      width: 400,
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: 30,
                    }}
                  >
                    <Skeleton.Button
                      active
                      style={{
                        width: 133,
                        height: 100,
                        borderRadius: 8,
                        marginRight: 20,
                      }}
                    >
                    </Skeleton.Button>
                    <Skeleton active paragraph={{ rows: 1 }}></Skeleton>
                  </div>
                </div>
              </Row>
            )}
            {!loading2 && hotList?.length === 0 && (
              <Col span={24}>
                <Empty></Empty>
              </Col>
            )}
            {!loading2 && hotList?.length > 0 && (
              <div className={styles['right-box']}>
                {hotList.map((item: any) => (
                  <div key={item.id} className={styles['topic-item']}>
                    <div
                      className={styles['topic-item-comp']}
                      onClick={() => goDetail(item.id)}
                    >
                      <div className={styles['topic-thumb']}>
                        <div className={styles['thumb-bar']}>
                          <ThumbBar
                            value={item.coverLink}
                            width={133}
                            height={100}
                            border={null}
                          />
                        </div>
                      </div>
                      <div className={styles['topic-body']}>
                        <div className={styles['topic-title']}>
                          {item.title}
                        </div>
                        <div className={styles['topic-info']}>
                          <div className={styles.category}>
                            {item?.category?.name}
                          </div>
                          <span className={styles['read-count']}>
                            {item.readCount}
                            次阅读
                          </span>
                          {/* <span className={styles['thumb-count']}>
                            {item.thumbCount}
                            次点赞
                          </span>
                          <span className={styles['collect-count']}>
                            {item.collectCount}
                            次收藏
                          </span> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default TopicPage
