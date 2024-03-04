import React, { useEffect, useState } from 'react'
import { Col, Pagination, Row, Skeleton } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { practice } from '../../../api/index'
import {
  Empty,
  FilterCategories,
  PracticeCourseItem,
} from '../../../components'
import styles from './index.module.scss'

function ExamPracticePage() {
  document.title = '练习模式'
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [init, setInit] = useState<boolean>(true)
  const [list, setList] = useState<any>([])
  const [refresh, setRefresh] = useState(false)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<any>([])
  const [userpapers, setUserpapers] = useState<any>([])
  const result = new URLSearchParams(useLocation().search)
  const [cid, setCid] = useState(Number(result.get('cid')) || 0)
  const [child, setChild] = useState(Number(result.get('child')) || 0)

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
    practice
      .list({
        pageNum: page,
        pageSize: size,
        cid,
        childId: child,
      })
      .then((res: any) => {
        const categoriesData: any = []
        res.data.categories.forEach((item: any) => {
          const categoryItem: any = {
            id: item.id,
            name: item.name,
            children: [],
          }
          if (typeof res.data.childrenCategories[item.id] !== 'undefined') {
            categoryItem.children.push(
              ...res.data.childrenCategories[item.id],
            )
          }
          categoriesData.push(categoryItem)
        })
        setList(res.data.data.data)
        setTotal(res.data.data.total)
        setCategories(categoriesData)
        const papers = res.data.user_papers
        if (papers) {
          const data = [...userpapers]
          const newData = Object.assign(data, papers)
          setUserpapers(newData)
        }
        setLoading(false)
        setInit(false)
      })
  }

  return (
    <div className="container">
      <div className="bread-nav">
        <a
          onClick={() => {
            navigate('/exam')
          }}
        >
          考试练习
        </a>
        {' '}
        /
        <span>练习模式</span>
      </div>
      <div className={styles.content}>
        <div className={styles['filter-two-class']}>
          {loading && init && (
            <Skeleton.Button
              active
              style={{
                width: 1140,
                height: 24,
                marginTop: 15,
                marginBottom: 15,
              }}
            >
            </Skeleton.Button>
          )}
          {!init && (
            <FilterCategories
              loading={loading}
              categories={categories}
              defaultKey={cid}
              defaultChild={child}
              onSelected={(id: number, child: number) => {
                setCid(id)
                setChild(child)
                if (id === 0)
                  navigate('/exam/practice')
                else if (child === 0)
                  navigate(`/exam/practice?cid=${id}`)
                else
                  navigate(`/exam/practice?cid=${id}&child=${child}`)

                resetList()
              }}
            />
          )}
        </div>
        {loading && (
          <Row style={{ width: 1200 }}>
            <div
              style={{
                width: 1200,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Skeleton.Button
                active
                style={{
                  width: 1200,
                  height: 116,
                  borderRadius: 8,
                  marginTop: 30,
                  marginBottom: 10,
                }}
              >
              </Skeleton.Button>
              <Skeleton.Button
                active
                style={{
                  width: 1200,
                  height: 116,
                  borderRadius: 8,
                  marginTop: 30,
                  marginBottom: 10,
                }}
              >
              </Skeleton.Button>
              <Skeleton.Button
                active
                style={{
                  width: 1200,
                  height: 116,
                  borderRadius: 8,
                  marginTop: 30,
                  marginBottom: 10,
                }}
              >
              </Skeleton.Button>
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
              <PracticeCourseItem
                key={item.id}
                cid={item.id}
                title={item.name}
                charge={item.charge}
                userCount={item.user_count}
                category={item.category}
                records={userpapers}
                isFree={item.cur_user_can_join}
                isVipFree={item.is_vip_free}
                questionCount={item.question_count}
              >
              </PracticeCourseItem>
            ))}
          </div>
        )}
        {!loading && list.length > 0 && size < total && (
          <Col
            span={24}
            style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}
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
  )
}

export default ExamPracticePage
