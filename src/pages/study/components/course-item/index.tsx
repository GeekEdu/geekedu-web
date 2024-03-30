import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThumbBar } from '../../../../components/thumb-bar'
import { dateFormat } from '../../../../utils/index'
import { DetailDialog } from '../detail-dialog'
import styles from './index.module.scss'

interface PropInterface {
  list: any[]
  currentStatus: number
}

export const CourseItemComp: React.FC<PropInterface> = ({
  list,
  currentStatus,
}) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [visiable, setVisiable] = useState<boolean>(false)
  const [cid, setCid] = useState(0)

  const goPlay = (item: any) => {
    if (item.progress < 100 && item?.last_view_video.length !== 0) {
      const vid = item?.last_view_video?.video_id
      navigate(`/courses/video/${vid}`)
    }
    else {
      goDetail(item.course.id)
    }
  }

  const goDetail = (id: number) => {
    const tab = currentStatus === 2 ? 3 : 2
    navigate(`/courses/detail/${id}?tab=${tab}`)
  }

  return (
    <>
      <DetailDialog
        open={visiable}
        id={cid}
        onCancel={() => setVisiable(false)}
      >
      </DetailDialog>
      <div className={styles.box}>
        {currentStatus === 1
        && list.map((item: any, index: any) => (
          <div className={styles['item-box']} key={`${index}course-learn`}>
            {item.course && item.course.id && (
              <div className={styles.item}>
                <div className={styles['left-item']}>
                  <ThumbBar
                    value={item.course.coverLink}
                    border={4}
                    width={160}
                    height={120}
                  >
                  </ThumbBar>
                  {/* {item.is_subscribe === 1 && (
                    <div className={styles.icon}>已订阅</div>
                  )} */}
                </div>
                <div className={styles['right-item']}>
                  <div className={styles['item-title']}>
                    {item.course.title}
                  </div>
                  <div className={styles['item-info']}>
                    <div className={styles['item-text']}>
                      已学完：
                      <span>
                        {item.learnedCount}
                        课时
                      </span>
                      {' '}
                      / 共
                      {item.course.sectionCount}
                      课时
                    </div>
                  </div>
                </div>
                <div
                  className={styles['detail-button']}
                  onClick={() => {
                    setCid(item.course.id)
                    setVisiable(true)
                  }}
                >
                  学习进度
                </div>
                {item?.isOver && (
                  <div
                    className={styles['completed-button']}
                    onClick={() => {
                      goPlay(item)
                    }}
                  >
                    学习完成
                  </div>
                )}
                {!item?.isOver && (
                  <div
                    className={styles['continue-button']}
                    onClick={() => {
                      goPlay(item)
                    }}
                  >
                    继续学习
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {currentStatus === 2
        && list.map((item: any) => (
          <div className={styles['item-box']} key={`${item.id}course-sub`}>
            {item.course && item.course.id && (
              <div className={styles.item}>
                <div className={styles['left-item']}>
                  <ThumbBar
                    value={item.course.thumb}
                    border={4}
                    width={160}
                    height={120}
                  >
                  </ThumbBar>
                  <div className={styles.icon}>已订阅</div>
                </div>
                <div className={styles['right-item']}>
                  <div className={styles['item-title']}>
                    {item.course.title}
                  </div>
                  <div className={styles['item-info']}>
                    <div className={styles['item-text']}>
                      已学完：
                      <span>
                        {item.learnedCount}
                        课时
                      </span>
                      {' '}
                      / 共
                      {item.course.sectionCount}
                      课时
                    </div>
                  </div>
                </div>
                <div
                  className={styles['detail-button']}
                  onClick={() => {
                    setCid(item.course.id)
                    setVisiable(true)
                  }}
                >
                  学习进度
                </div>
                <div
                  className={styles['continue-button']}
                  onClick={() => {
                    goDetail(item.course.id)
                  }}
                >
                  课程目录
                </div>
              </div>
            )}
          </div>
        ))}
        {currentStatus === 3
        && list.map((item: any) => (
          <div
            className={styles['item-box']}
            key={`${item.id}course-collect`}
          >
            {item?.course && item?.course?.id && (
              <div className={styles.item}>
                <div className={styles['left-item']}>
                  <ThumbBar
                    value={item?.course?.coverLink}
                    border={4}
                    width={160}
                    height={120}
                  >
                  </ThumbBar>
                </div>
                <div className={styles['right-item']}>
                  <div className={styles['item-title']}>
                    {item.course.title}
                  </div>
                  <div className={styles['item-info']}>
                    <div className={styles['item-text']}>
                      已学完：
                      <span>
                        {item.learnedCount}
                        课时
                      </span>
                      {' '}
                      / 共
                      {item.course.sectionCount}
                      课时
                    </div>
                    {item.collectTime && (
                      <div className={styles['item-text']}>
                        收藏时间：
                        {dateFormat(item.collectTime)}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={styles['continue-button']}
                  onClick={() => {
                    goDetail(item.courseId)
                  }}
                >
                  详情
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
