import React, { useEffect, useState } from 'react'
import { Button, Input, message } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Empty } from '../../components'
import { live } from '../../api/index'
import { getCommentTime } from '../../utils/index'
import styles from './index.module.scss'

interface PropInterface {
  cid: number
  comments: any[]
  commentUsers: any
  isBuy: boolean
  isVip: boolean
  success: () => void
}

export const LiveCourseComments: React.FC<PropInterface> = ({
  cid,
  isBuy,
  isVip,
  comments,
  commentUsers,
  success,
}) => {
  const navigate = useNavigate()
  const user = useSelector((state: any) => state.loginUser.value.user)
  const isLogin = useSelector((state: any) => state.loginUser.value.isLogin)
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const submitComment = () => {
    if (loading)
      return

    if (content === '')
      return

    setLoading(true)
    live
      .submitComment(cid, { content })
      .then(() => {
        message.success('成功')
        setContent('')
        setLoading(false)
        success()
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  return (
    <div className={styles['course-comments-box']}>
      <div className={styles['comment-divider']}>全部评论</div>
      <div className={styles.line}></div>
      {isLogin && (isBuy || isVip) && (
        <div className={styles.replybox}>
          <div className={styles.reply}>
            <img className={styles['user-avatar']} src={user.avatar} />
            <Input
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
              }}
              style={{ width: 960, height: 48, marginRight: 30, fontSize: 16 }}
              placeholder="此处填写你的评论"
            >
            </Input>
            <Button
              type="primary"
              disabled={content.length === 0}
              style={{ width: 72, height: 48, fontSize: 16, border: 'none' }}
              onClick={() => {
                submitComment()
              }}
              loading={loading}
            >
              评论
            </Button>
          </div>
        </div>
      )}
      {!isLogin && (
        <div className={styles.replybox}>
          <div className={styles.text} onClick={() => navigate('/login')}>
            未登录，请登录后再评论
          </div>
        </div>
      )}
      <div className={styles['comment-top']}>
        {comments.length === 0 && <Empty></Empty>}
        {comments.length > 0
        && comments.map((item: any) => (
          <div key={item.id} className={styles['comment-item']}>
            <div className={styles['user-avatar']}>
              <img src={commentUsers[item.userId].avatar} />
            </div>
            <div className={styles['comment-content']}>
              <div className={styles['comment-info']}>
                <div className={styles.nickname}>
                  {commentUsers[item.userId].name}
                </div>
                <div className={styles['comment-time']}>
                  {getCommentTime(item.createdTime)}
                </div>
              </div>
              <div className={styles['comment-text']}>{item.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
