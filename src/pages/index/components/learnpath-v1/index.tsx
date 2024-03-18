import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ThumbBar } from '../../../../components'
import styles from './index.module.scss'

interface PropInterface {
  items: any
  name: string
}

export const LearnPathComp: React.FC<PropInterface> = ({ items, name }) => {
  const navigate = useNavigate()
  const goDetail = (item: any) => {
    if (!item.id)
      return

    navigate(`/learnPath/detail/${item.id}`)
  }
  return (
    <>
      {items.length > 0 && (
        <div className={styles['index-section-box']}>
          <div className={styles['index-section-title']}>
            <div className={styles['index-section-title-text']}>{name}</div>
          </div>
          <div className={styles['index-section-body']}>
            {items.map((item: any, index: number) => (
              <div
                className={styles['learnpath-course-item']}
                key={`${item.id}path${index}`}
                onClick={() => goDetail(item)}
              >
                {!item.id && <div className={styles.whiteback}></div>}
                <div className={styles['learnpath-course-thumb']}>
                  <div className={styles['thumb-bar']}>
                    <ThumbBar
                      value={item.cover}
                      width={173}
                      height={130}
                      border={8}
                    />
                  </div>
                </div>
                <div className={styles['learnpath-course-body']}>
                  <div className={styles['learnpath-course-title']}>
                    {item.name}
                  </div>
                  <div className={styles['learnpath-course-info']}>
                    {item.price > 0 && (
                      <span className={styles['learnpath-course-charge']}>
                        <small>￥</small>
                        {item.price}
                      </span>
                    )}
                    {item.price === 0 && (
                      <span className={styles['green-free']}>免费</span>
                    )}
                    <span className={styles['learnpath-course-step']}>
                      <span>
                        {item.stepCount}
                        步骤
                      </span>
                      <span className={styles.colline}>|</span>
                      <span>
                        {item.courseCount}
                        课程
                      </span>
                    </span>
                  </div>
                  <p className={styles['learnpath-course-sub']}>{item.intro}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
