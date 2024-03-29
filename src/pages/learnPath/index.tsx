/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-14 16:23:31
 * @FilePath: /geekedu-web/src/pages/learnPath/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react'
import { Col, Pagination, Row, Skeleton } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { path } from '../../api/index'
import { Empty, FilterCategories, LearnPathCourseItem } from '../../components'
import styles from './index.module.scss'

function LearnPathPage() {
  document.title = '学习路径'
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<any>([])
  const [categories, setCategories] = useState<any>([])
  const [refresh, setRefresh] = useState(false)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(16)
  const [total, setTotal] = useState(0)
  const [steps, setSteps] = useState<any>([])
  const result = new URLSearchParams(useLocation().search)
  const [cid, setCid] = useState(Number(result.get('cid')) || 0)
  const [child, setChild] = useState(Number(result.get('child')) || 0)

  useEffect(() => {
    getParams()
  }, [])

  useEffect(() => {
    getList()
  }, [refresh, page, size])

  const resetList = () => {
    setPage(1)
    setList([])
    setRefresh(!refresh)
  }

  const getList = () => {
    if (loading)
      return

    setLoading(true)
    let category_id = 0
    if (child === 0 || cid == 0)
      category_id = cid
    else
      category_id = child

    path
      .list({
        pageNum: page,
        pageSize: size,
        categoryId: category_id,
      })
      .then((res: any) => {
        setList(res.data.data.data)
        setSteps(res.data.steps)
        setTotal(res.data.data.total)

        setLoading(false)
      })
  }

  const getParams = () => {
    path.create({}).then((res: any) => {
      setCategories(res.data)
    })
  }

  const stepsCount = (item: any) => {
    const id = item.id
    if (typeof steps[id] === 'undefined')
      return 0

    return steps[id].length
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
          if (id === 0)
            navigate('/learnPath')
          else if (child === 0)
            navigate(`/learnPath?cid=${id}`)
          else
            navigate(`/learnPath?cid=${id}&child=${child}`)

          resetList()
        }}
      />
      <div className="container">
        {loading && (
          <Row style={{ width: 1200 }}>
            <div
              style={{
                width: 1200,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginTop: 30,
              }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 264,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Skeleton.Button
                    active
                    style={{
                      width: 264,
                      height: 198,
                      borderRadius: '8px 8px 0 0',
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
        {!loading && list.length > 0 && (
          <div className={styles['list-box']}>
            {list.map((item: any) => (
              <LearnPathCourseItem
                key={item.id}
                cid={item.id}
                thumb={item.cover}
                desc={item.intro}
                name={item.name}
                coursesCount={item.courseCount}
                stepsCount={stepsCount(item)}
                charge={item.price}
                originalCharge={item.originPrice}
              >
              </LearnPathCourseItem>
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
    </>
  )
}

export default LearnPathPage
