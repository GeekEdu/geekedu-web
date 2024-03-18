import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ThumbBar } from '../../../../components'
import styles from './index.module.scss'

interface PropInterface {
  items: any
  name: string
}

export const BookComp: React.FC<PropInterface> = ({ items, name }) => {
  const navigate = useNavigate()
  const goBookDetail = (item: any) => {
    navigate(`/book/detail/${item.id}`)
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
                className={styles['book-course-item']}
                key={`${item.id}book${index}`}
                onClick={() => goBookDetail(item)}
              >
                <div className={styles['book-course-thumb']}>
                  <div className={styles['thumb-bar']}>
                    <ThumbBar
                      value={item.coverLink}
                      width={120}
                      height={160}
                      border={8}
                    />
                  </div>
                </div>
                <div className={styles['book-course-body']}>
                  <div className={styles['book-course-title']}>{item.name}</div>
                  <div className={styles['book-course-info']}>
                    <div className={styles['book-course-charge']}>
                      {item.price > 0 && (
                        <span className={styles['charge-text']}>
                          <span className={styles.unit}>￥</span>
                          {item.price}
                        </span>
                      )}
                      {item.price === 0 && (
                        <span className={styles['free-text']}>免费</span>
                      )}
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
