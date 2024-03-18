import React from 'react'
import { VodCourseItem } from '../../../../components'
import styles from './index.module.scss'

interface PropInterface {
  items: any
  name: string
}

export const VodComp: React.FC<PropInterface> = ({ items, name }) => {
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
                key={`${item.id}vod${index}`}
              >
                <VodCourseItem
                  cid={item.id}
                  videosCount={item.sectionCount}
                  thumb={item.coverLink}
                  category={item?.category}
                  title={item.title}
                  charge={item.price}
                  isFree={item.isFree}
                  userCount={item.userCount}
                >
                </VodCourseItem>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
