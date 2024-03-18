import React from 'react'
import { LiveCourseItem } from '../../../../components'
import styles from './index.module.scss'

interface PropInterface {
  items: any
  name: string
}

export const LiveComp: React.FC<PropInterface> = ({ items, name }) => {
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
                className={styles['vod-course-item']}
                key={`${item.id}live${index}`}
              >
                <LiveCourseItem
                  cid={item.id}
                  thumb={item.cover}
                  category={item?.category}
                  title={item.title}
                  charge={item.price}
                >
                </LiveCourseItem>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
