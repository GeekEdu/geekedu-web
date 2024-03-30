import React, { useEffect, useState } from 'react'
import { Col, Row, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { dateFormat } from '../../../../utils/index'
import { study } from '../../../../api/index'
import { DurationText, Empty } from '../../../../components'
import closeIcon from '../../../../assets/img/commen/icon-close.png'
import styles from './index.module.scss'

interface PropInterface {
  open: boolean
  id: number
  onCancel: () => void
}

export const DetailDialog: React.FC<PropInterface> = ({
  open,
  onCancel,
  id,
}) => {
  const navigate = useNavigate()
  const [list, setList] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setList([])
    if (open && id > 0)
      getData()
  }, [open, id])

  const getData = () => {
    if (loading)
      return

    setLoading(true)
    study
      .coursesDetail(id, {})
      .then((res: any) => {
        const data = res.data
        const arr: any = []
        for (const i in data)
          arr.push(data[i])

        setList(arr)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  const goPlay = (item: any) => {
    navigate(`/courses/video/${item.videoId}`)
  }

  return (
    <>
      {open && (
        <div className={styles.mask}>
          <div className={styles['dialog-login-box']}>
            <div className={styles['dialog-tabs']}>
              <div className={styles['item-tab']}>学习进度</div>
              <img
                className={styles['btn-close']}
                onClick={() => onCancel()}
                src={closeIcon}
              />
            </div>
            <div className={styles['progress-box']}>
              {loading && (
                <Row>
                  <div className="float-left d-j-flex">
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
                <div
                  className={styles['progress-item']}
                  key={item.videoId}
                  onClick={() => goPlay(item)}
                >
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles['item-time']}>
                    {item.duration !== 0
                      ? (
                        <DurationText
                          seconds={item.duration}
                        >
                        </DurationText>
                        )
                      : (
                        <span>0:00</span>
                        )}
                    {' '}
                    /
                    {' '}
                    <DurationText seconds={item.total}></DurationText>
                  </div>
                  {item.duration >= item.total
                    ? (
                      <div className={styles['item-text']}>已学完</div>
                      )
                    : (
                      <div className={styles['item-progress']}>未学完</div>
                      )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
