import React, { useEffect, useState } from 'react'
import { Button, Col, Pagination, Row, Skeleton } from 'antd'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { wenda } from '../../api/index'
import {
  CreateQuestionDialog,
  Empty,
  FilterCategories,
  FilterScenes,
  QaItem,
} from '../../components'
import { changeUserCredit } from '../../store/user/loginUserSlice'
import styles from './index.module.scss'

function WendaPage() {
  document.title = '在线问答'
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [init, setInit] = useState(true)
  const [list, setList] = useState<any>([])
  const [categories, setCategories] = useState<any>([])
  const [refresh, setRefresh] = useState(false)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(16)
  const [total, setTotal] = useState(0)
  const [pcDiyContent, setPcDiyContent] = useState<any>('')
  const [visiable, setVisiable] = useState(false)
  const [status, setStatus] = useState(false)
  const [enableCredit1, setEnableCredit1] = useState(false)
  const result = new URLSearchParams(useLocation().search)
  const [scene, setScene] = useState(result.get('scene') || 'default')
  const [cid, setCid] = useState(Number(result.get('cid')) || 0)
  const [child, setChild] = useState(Number(result.get('child')) || 0)
  const user = useSelector((state: any) => state.loginUser.value.user)
  const isLogin = useSelector((state: any) => state.loginUser.value.isLogin)
  const scenes = [
    {
      id: 'default',
      name: '综合',
    },
    {
      id: 'solved',
      name: '已解决',
    },
    {
      id: 'unsolved',
      name: '未解决',
    },
    {
      id: 'last_answer',
      name: '最新回答',
    },
  ]

  useEffect(() => {
    getConfig()
  }, [])

  useEffect(() => {
    getList()
  }, [refresh, page, size])

  const getList = () => {
    if (loading)
      return

    setLoading(true)
    let category_id = 0
    if (child === 0 || cid == 0)
      category_id = cid
    else
      category_id = child

    wenda
      .list({
        pageNum: page,
        pageSize: size,
        scene,
        categoryId: category_id,
      })
      .then((res: any) => {
        setCategories(res.data.categories)
        setList(res.data.data.data)
        setTotal(res.data.data.total)
        setLoading(false)
        setStatus(true)
      })
  }

  const resetList = () => {
    setPage(1)
    setList([])
    setRefresh(!refresh)
  }

  const resetNewList = (scene: any) => {
    setList([])
    let category_id = 0
    if (child === 0 || cid == 0)
      category_id = cid
    else
      category_id = child

    wenda
      .list({
        pageNum: 1,
        pageSize: size,
        scene,
        categoryId: category_id,
      })
      .then((res: any) => {
        setCategories(res.data.categories)
        setList(res.data.data.data)
        setTotal(res.data.data.total)
      })
  }

  const getConfig = () => {
    wenda.config().then((res: any) => {
      setPcDiyContent(res.data.diyContent)
      if (res.data.enableRewardScore)
        setEnableCredit1(true)
      else
        setEnableCredit1(false)

      setInit(false)
    })
  }

  const goLogin = () => {
    const url = encodeURIComponent(
      window.location.pathname + window.location.search,
    )
    navigate(`/login?redirect=${url}`)
  }

  const createSuccess = (id: number, credit1: number) => {
    setVisiable(false)
    const credit = Number(user.credit1) - Number(credit1)
    changeUserCredit(credit)
    setTimeout(() => {
      navigate(`/wenda/detail/${id}`)
    }, 600)
  }

  return (
    <>
      <FilterCategories
        loading={loading}
        categories={categories}
        defaultKey={cid}
        defaultChild={child}
        onSelected={(id: number, child: number) => {
          setCid(id)
          setChild(child)
          if (id === 0) {
            navigate(`/wenda?scene=${scene}`)
          }
          else if (child === 0) {
            navigate(`/wenda?cid=${cid}&scene=${scene}`)
          }
          else {
            navigate(
              `/wenda?cid=${cid}&child=${child}&scene=${scene}`,
            )
          }
          resetList()
        }}
      />
      <FilterScenes
        scenes={scenes}
        defaultKey="default"
        onSelected={(id: string) => {
          setScene(id)
          if (cid === 0)
            navigate(`/wenda?scene=${id}`)
          else
            navigate(`/wenda?cid=${cid}&child=${child}&scene=${id}`)

          resetNewList(id)
        }}
      />
      <CreateQuestionDialog
        open={visiable}
        enable={enableCredit1}
        onCancel={() => setVisiable(false)}
        onSuccess={(id: number, credit1: number) => createSuccess(id, credit1)}
      >
      </CreateQuestionDialog>
      <div className={styles.contanier}>
        <div className={styles['qa-box']}>
          {loading && (
            <Row>
              <div
                style={{
                  width: 769,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 769,
                      height: 134,
                      display: 'flex',
                      flexDirection: 'row',
                      padding: '4px 20px 20px 20px',
                      boxSizing: 'border-box',
                      marginBottom: 10,
                    }}
                  >
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
          {!loading && list.length > 0 && (
            <div className={styles['list-box']}>
              {list.map((item: any) => (
                <QaItem
                  key={item.id}
                  cid={item.id}
                  credit1={item.rewardScore}
                  statusText={item.statusText}
                  status={item.questionStatus}
                  title={item.title}
                  viewTimes={item.viewCount}
                  answerCount={item.answerCount}
                  voteCount={item.thumbCount}
                >
                </QaItem>
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
          <div className={styles.cont}>
            {!init && status && (
              <Button
                type="primary"
                className={styles['create-button']}
                onClick={() => {
                  if (!isLogin) {
                    goLogin()
                    return
                  }
                  setVisiable(true)
                }}
              >
                我要提问
              </Button>
            )}
            {init && (
              <Skeleton
                style={{ marginTop: 30 }}
                active
                paragraph={{ rows: 2 }}
              >
              </Skeleton>
            )}
            {!init && (
              <>
                {pcDiyContent && pcDiyContent !== '' && (
                  <div
                    className={styles['wenda-tips']}
                    dangerouslySetInnerHTML={{ __html: pcDiyContent }}
                  >
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default WendaPage
