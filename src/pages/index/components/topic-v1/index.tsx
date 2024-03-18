import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ThumbBar } from '../../../../components'
import styles from './index.module.scss'

interface PropInterface {
  items: any
  name: string
}

export const TopicComp: React.FC<PropInterface> = ({ items, name }) => {
  const navigate = useNavigate()
  const goDetail = (item: any) => {
    navigate(`/topic/detail/${item.id}`)
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
                className={styles['topic-course-item']}
                key={`${item.id}topic${index}`}
                onClick={() => goDetail(item)}
              >
                <div className={styles['topic-course-thumb']}>
                  <div className={styles['thumb-bar']}>
                    <ThumbBar
                      value={item.coverLink}
                      width={133}
                      height={100}
                      border={8}
                    />
                  </div>
                </div>
                <div className={styles['topic-course-body']}>
                  <div className={styles['topic-course-title']}>
                    {item.title}
                  </div>
                  <div className={styles['topic-course-info']}>
                    {item?.category && (
                      <div className={styles['topic-course-type']}>
                        {item?.category?.name}
                      </div>
                    )}
                    <div className={styles['topic-course-sub']}>
                      <span>
                        {item.readCount}
                        人已阅读
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
