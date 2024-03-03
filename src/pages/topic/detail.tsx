import { useEffect, useState } from 'react'
import { Button, Col, Input, Skeleton, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { topic as topicApi } from '../../api/index'
import { Empty, HistoryRecord, ShareComp } from '../../components'
import {
  changeTime,
  codeRender,
  getCommentTime,
  latexRender,
} from '../../utils/index'
import voteIcon from '../../assets/img/commen/icon-vote-h.png'
import noVoteIcon from '../../assets/img/commen/icon-vote-n.png'
import likeIcon from '../../assets/img/commen/icon-collect-h.png'
import noLikeIcon from '../../assets/img/commen/icon-collect-n.png'
import defaultAvatar from '../../assets/img/commen/default-avatar.jpg'
import styles from './detail.module.scss'

function TopicDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const [loading, setLoading] = useState<boolean>(false)
  const [commentLoading, setCommentLoading] = useState<boolean>(false)
  const [topic, setTopic] = useState<any>({})
  const [isBuy, setIsBuy] = useState<boolean>(false)
  const [isVote, setIsVote] = useState<boolean>(false)
  const [isLike, setIsLike] = useState<boolean>(false)
  const [content, setContent] = useState<string>('')
  const [commentList, setCommentList] = useState<any>([])
  const [commentUsers, setCommentUsers] = useState<any>([])
  const [replyAnswers, setReplyAnswers] = useState<any>([])
  const [configkey, setConfigkey] = useState<any>([])
  const [replyContent, setReplyContent] = useState<string>('')
  const [answerId, setAnswerId] = useState(0)
  const [configInput, setConfigInput] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10000)
  const [total, setTotal] = useState(0)
  const [commentId, setCommentId] = useState<number>(0)
  const [id, setId] = useState(Number(params.courseId))
  const user = useSelector((state: any) => state.loginUser.value.user)
  const isLogin = useSelector((state: any) => state.loginUser.value.isLogin)

  useEffect(() => {
    getDetail()
    getComments()
  }, [id])

  useEffect(() => {
    setId(Number(params.courseId))
  }, [params.courseId])

  useEffect(() => {
    latexRender(document.getElementById('math'))
    codeRender(document.getElementById('math'))
  }, [document.getElementById('math')])

  const getDetail = () => {
    if (loading)
      return

    setLoading(true)
    topicApi.detail(id).then((res: any) => {
      document.title = res.data.imageText.title
      setTopic(res.data.imageText)
      setIsBuy(res.data.isBuy)
      setIsLike(res.data.isCollect)
      setIsVote(res.data.isThumb)
      setLoading(false)
    })
  }

  const getComments = () => {
    if (commentLoading)
      return

    setCommentLoading(true)
    topicApi
      .comments(id, {
        pageNum: page,
        pageSize: size,
        commentId,
      })
      .then((res: any) => {
        const users: any = [...commentUsers]
        for (const key in res.data.users)
          users[key] = res.data.users[key]

        setCommentUsers(users)
        setCommentList(res.data.data)
        setTotal(res.data.total)
        setCommentLoading(false)
      })
      .catch((e) => {
        setCommentLoading(false)
      })
  }

  const resetComment = () => {
    setCommentLoading(false)
    setCommentUsers([])
    setPage(1)
    setCommentList([])
    setReplyAnswers([])
    setConfigkey([])
    setConfigInput({})
    setContent('')
  }

  const vote = () => {
    if (!isLogin) {
      goLogin()
      return
    }
    topicApi.vote(id, {}).then((res: any) => {
      const value = res.data.ok === 1
      setIsVote(value)
      if (value) {
        const data = { ...topic }
        data.vote_count++
        setTopic(data)
        message.success('已点赞')
      }
      else {
        const data = { ...topic }
        data.vote_count--
        setTopic(data)
        message.success('取消点赞')
      }
    })
  }

  const likeHit = () => {
    if (!isLogin) {
      goLogin()
      return
    }
    topicApi.collect(id, {}).then((res: any) => {
      const value = !isLike
      setIsLike(value)
      if (value)
        message.success('已收藏')
      else
        message.success('取消收藏')
    })
  }

  const goLogin = () => {
    const url = encodeURIComponent(
      window.location.pathname + window.location.search,
    )
    navigate(`/login?redirect=${url}`)
  }

  const buyVip = () => {
    navigate('/vip')
  }

  const buy = () => {
    if (!isLogin) {
      goLogin()
      return
    }
    navigate(
      `/order?goods_id=${
      topic.id
         }&goods_type=topic&goods_charge=${
         topic.charge
         }&goods_label=文章&goods_name=${
         topic.title
         }&goods_thumb=${
         topic.thumb}`,
    )
  }

  const submitComment = () => {
    if (commentLoading)
      return

    if (content === '')
      return

    setCommentLoading(true)
    topicApi
      .submitComment(id, { content })
      .then((res: any) => {
        message.success('评论成功')
        const item = {
          id: res.data,
          parentId: 0,
          content,
          childrenCount: 0,
          replyId: 0,
          reply: null,
          reply_user: [],
          reply_user_id: 0,
          createdTime: '刚刚',
          user: {
            avatar: user.avatar,
            name: user.name,
          },
        }
        const list = [...commentList]
        list.unshift(item)
        setCommentList(list)
        const answers = [...replyAnswers]
        answers.unshift(false)
        setReplyAnswers(answers)
        const keys = [...configkey]
        keys.unshift(false)
        setConfigkey(keys)
        setContent('')
        setCommentLoading(false)
      })
      .catch((e: any) => {
        setCommentLoading(false)
      })
  }

  const showReply = (id: number) => {
    if (!isLogin) {
      goLogin()
      return
    }
    const arr = []
    arr[id] = true
    setConfigInput(arr)
    setReplyContent('')
  }

  const getAnswer = (index: number, id: number) => {
    if (id === 0)
      return

    const keys = [...configkey]
    keys[index] = !keys[index]
    setConfigkey(keys)
    setCommentId(id)
    topicApi
      .allComments(topic.id, {
        pageNum: page,
        pageSize: size,
        commentId: id,
      })
      .then((res: any) => {
        const arr1 = [...replyAnswers]
        arr1[index] = res.data.data
        setReplyAnswers(arr1)
      })
  }

  const reply = (
    parentId: number,
    id: any,
    name: string,
    index: number,
  ) => {
    if (commentLoading)
      return

    if (!name) {
      message.error('回复的用户不存在')
      return
    }
    if (!replyContent)
      return

    setAnswerId(id)
    setCommentLoading(true)
    topicApi
      .releaseComments(topic.id, {
        parentId,
        content: replyContent,
        replyId: id,
      })
      .then((res: any) => {
        setConfigInput([])
        message.success('回复成功')
        setCommentLoading(false)
        let item
        if (id) {
          item = {
            id: res.data,
            parentId,
            content: replyContent,
            childrenCount: 0,
            reply: {
              user: { name },
            },
            createdTime: '刚刚',
            user: {
              avatar: user.avatar,
              name: user.name,
            },
          }
          let old
          if (replyAnswers[index]) {
            old = replyAnswers[index]
            old.unshift(item)
          }
          else {
            old = []
          }
          const arr1 = [...replyAnswers]
          arr1[index] = old
          setReplyAnswers(arr1)
          const list = [...commentList]
          list[index].children_count = list[index].children_count + 1
          setCommentList(list)
          setReplyContent('')
        }
        else {
          item = {
            id: res.data.comment_id,
            parent_id: parentId,
            content: replyContent,
            children_count: 0,
            reply_comment: null,
            created_at: '刚刚',
            user: {
              avatar: user.avatar,
              name: user.name,
            },
          }
          let old
          if (replyAnswers[index]) {
            old = replyAnswers[index]
            old.unshift(item)
          }
          else {
            old = []
          }
          const arr1 = [...replyAnswers]
          arr1[index] = old
          setReplyAnswers(arr1)
          const list = [...commentList]
          list[index].children_count = list[index].children_count + 1
          setCommentList(list)
          setReplyContent('')
          const arr2 = [...configkey]
          arr2[index] = true
          setConfigkey(arr2)
          setCommentId(parentId)
          topicApi
            .allComments(topic.id, {
              pageNum: page,
              pageSize: size,
              commentId: parentId,
            })
            .then((res: any) => {
              const arr1 = [...replyAnswers]
              arr1[index] = res.data.data
              setReplyAnswers(arr1)
            })
        }
      })
      .catch((e: any) => {
        setCommentLoading(false)
      })
  }

  return (
    <>
      <div className="container">
        <div className="bread-nav">
          {loading && (
            <Skeleton.Button
              active
              style={{
                width: 1200,
                height: 14,
                marginLeft: 0,
              }}
            >
            </Skeleton.Button>
          )}
          {!loading && (
            <>
              <a
                onClick={() => {
                  navigate('/')
                }}
              >
                首页
              </a>
              {' '}
              /
              <a
                onClick={() => {
                  navigate('/topic')
                }}
              >
                图文
              </a>
              {' '}
              /
              <span>{topic.title}</span>
            </>
          )}
        </div>
        <div className={styles.box}>
          <div className={styles['topic-box']}>
            <div className={styles.topic}>
              <HistoryRecord id={topic.id} title={topic.title} type="topic" />
              {loading && (
                <div
                  style={{
                    width: 806,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Skeleton.Button
                    active
                    style={{
                      width: 806,
                      height: 48,
                    }}
                  >
                  </Skeleton.Button>
                  <Skeleton.Button
                    active
                    style={{
                      width: 806,
                      height: 14,
                      marginTop: 10,
                    }}
                  >
                  </Skeleton.Button>
                </div>
              )}
              {!loading && (
                <>
                  <div className={styles['topic-title']}>{topic.title}</div>
                  <div className={styles['topic-stat']}>
                    <span className={styles['div-times']}>
                      {changeTime(topic.createdTime)}
                    </span>
                    <span className={styles['div-times']}>
                      {topic.readCount}
                      次阅读
                    </span>
                    <span className={styles['div-times']}>
                      {topic.thumbCount}
                      人赞过
                    </span>
                  </div>
                </>
              )}
              <div className={styles.line}></div>
              <div className={styles['topic-content']}>
                {loading && (
                  <Skeleton active paragraph={{ rows: 3 }}></Skeleton>
                )}
                {isBuy && (
                  <div className="u-content md-content">
                    {topic.free_content_render && (
                      <div
                        id="math"
                        dangerouslySetInnerHTML={{
                          __html: topic.freeRenderContent,
                        }}
                      >
                      </div>
                    )}
                    <div
                      id="math"
                      dangerouslySetInnerHTML={{
                        __html: topic.renderContent,
                      }}
                    >
                    </div>
                  </div>
                )}
                {!isBuy && (
                  <>
                    <div className="free-content u-content md-content">
                      <div
                        id="math"
                        dangerouslySetInnerHTML={{
                          __html: topic.freeRenderContent,
                        }}
                      >
                      </div>
                    </div>
                    <div className={styles.buttons}>
                      {!isLogin && (
                        <div
                          className={styles['login-button']}
                          onClick={() => goLogin()}
                        >
                          请登录后查看
                        </div>
                      )}
                      {isLogin && (
                        <>
                          {topic.isVipFree === 1 && (
                            <div
                              className={styles['vip-buy-button']}
                              onClick={() => buyVip()}
                            >
                              会员免费看
                            </div>
                          )}
                          {topic.charge > 0 && (
                            <div
                              className={styles['buy-button']}
                              onClick={() => buy()}
                            >
                              解锁全文￥
                              {topic.price}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={styles['comments-box']}>
              <div className={styles['comment-divider']}>全部评论</div>
              <div className={styles.line}></div>
              {isLogin && isBuy && (
                <div className={styles['reply-box']}>
                  {user && (
                    <div className={styles.avatar}>
                      <img src={user.avatar} />
                    </div>
                  )}
                  <Input
                    className={styles['input-box']}
                    onChange={(e) => {
                      setContent(e.target.value)
                    }}
                    value={content}
                    placeholder="此处填写你的评论"
                  >
                  </Input>
                  {content === '' && (
                    <Button className={styles['disabled-button']}>评论</Button>
                  )}
                  {content !== '' && (
                    <Button
                      type="primary"
                      loading={commentLoading}
                      className={styles['confirm-button']}
                      onClick={() => submitComment()}
                    >
                      评论
                    </Button>
                  )}
                </div>
              )}
              <div className={styles['comments-list-box']}>
                {commentList.length === 0 && (
                  <Col span={24}>
                    <Empty></Empty>
                  </Col>
                )}
                {commentList.length > 0
                && commentList.map((item: any, index: number) => (
                  <div key={item.id} className={styles['comment-item']}>
                    <div className={styles.avatar}>
                      {item.user.length !== 0 && (
                        <img src={item.user.avatar} />
                      )}
                      {item.user.length === 0 && <img src={defaultAvatar} />}
                    </div>
                    <div className={styles['comment-content']}>
                      <div className={styles['top-info']}>
                        {item.user.length === 0 && (
                          <div className={styles.nickname}>未知用户</div>
                        )}
                        {item.user.length !== 0 && (
                          <div className={styles.nickname}>
                            {item.user.name}
                          </div>
                        )}
                        <div className={styles.diff}>
                          {getCommentTime(item.createdTime)}
                        </div>
                      </div>
                      <div className={styles.text}>{item.content}</div>
                      <div className={styles['reply-answer-box']}>
                        {isBuy && item.user.length !== 0 && (
                          <div
                            className={
                                configInput[index] === true
                                  ? styles['reply-trans-answer']
                                  : styles['reply-answer']
                              }
                            onClick={() => showReply(item.id)}
                          >
                            回复
                          </div>
                        )}
                        {item.childrenCount !== 0 && (
                          <div
                            className={
                                configkey[index] === true
                                  ? styles['reply-trans-answer']
                                  : styles['reply-answer']
                              }
                            onClick={() => getAnswer(index, item.id)}
                          >
                            {item.childrenCount}
                            回复
                          </div>
                        )}
                      </div>
                      {isLogin && isBuy && configInput[item.id] === true && (
                        <div className={styles['one-class-replybox']}>
                          <Input
                            className={styles['input-box']}
                            value={replyContent}
                            onChange={(e) => {
                              setReplyContent(e.target.value)
                            }}
                            placeholder={`回复${item.user.name}`}
                          >
                          </Input>
                          {replyContent === '' && (
                            <Button
                              type="primary"
                              className={styles['disabled-button']}
                            >
                              发表回复
                            </Button>
                          )}
                          {replyContent !== '' && (
                            <Button
                              type="primary"
                              loading={commentLoading}
                              className={styles['confirm-button']}
                              onClick={() =>
                                reply(
                                  item.id,
                                  null,
                                  item.user.name,
                                  index,
                              )}
                            >
                              发表回复
                            </Button>
                          )}
                        </div>
                      )}
                      {configkey[index] === true && (
                        <div className={styles['reply-list-box']}>
                          {replyAnswers.length > 0
                          && replyAnswers[index]
                          && replyAnswers[index].map((replyItem: any) => (
                            <div
                              key={replyItem.id}
                              className={styles['reply-list-item']}
                            >
                              <div className={styles['reply-avatar']}>
                                {replyItem.user.length !== 0 && (
                                  <img src={replyItem.user.avatar} />
                                )}
                                {replyItem.user.length === 0 && (
                                  <img src={defaultAvatar} />
                                )}
                              </div>
                              <div className={styles['reply-content']}>
                                <div className={styles['top-info']}>
                                  {replyItem.user.length === 0 && (
                                    <div
                                      className={
                                            styles['red-reply-nickname']
                                          }
                                    >
                                      未知用户
                                    </div>
                                  )}
                                  {replyItem.user.length !== 0 && (
                                    <div
                                      className={styles['reply-nickname']}
                                    >
                                      <>
                                        {replyItem.user.name}
                                        {replyItem.reply
                                        != null && (
                                          <>
                                            回复：
                                            {
                                              replyItem.reply.user.name
                                            }
                                          </>
                                        )}
                                      </>
                                    </div>
                                  )}
                                  <div className={styles['reply-diff']}>
                                    {getCommentTime(replyItem.createdTime)}
                                  </div>
                                </div>
                                <div className={styles['reply-text']}>
                                  {replyItem.content}
                                </div>
                                {isBuy && replyItem.user.length !== 0 && (
                                  <div
                                    className={styles['answer-item']}
                                    onClick={() => showReply(replyItem.id)}
                                  >
                                    回复
                                  </div>
                                )}
                                {isLogin
                                && isBuy
                                && configInput[replyItem.id] === true && (
                                  <div
                                    className={
                                            styles['Two-class-replybox']
                                          }
                                  >
                                    <Input
                                      className={styles['input-box']}
                                      value={replyContent}
                                      onChange={(e) => {
                                        setReplyContent(e.target.value)
                                      }}
                                      placeholder={
                                              `回复${replyItem.user.name}`
                                            }
                                    >
                                    </Input>
                                    {replyContent === '' && (
                                      <Button
                                        type="primary"
                                        className={
                                                styles['disabled-button']
                                              }
                                      >
                                        发表回复
                                      </Button>
                                    )}
                                    {replyContent !== '' && (
                                      <Button
                                        type="primary"
                                        loading={commentLoading}
                                        className={
                                                styles['confirm-button']
                                              }
                                        onClick={() =>
                                          reply(
                                            item.id,
                                            replyItem.id,
                                            replyItem.user.name,
                                            index,
                                        )}
                                      >
                                        发表回复
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* {topic && (
            <div className={styles['share-box']}>
              <ShareComp
                cid={topic.id}
                title={topic.title}
                thumb={topic.thumb}
              >
              </ShareComp>
              {isVote && (
                <div
                  className={styles['active-vote-button']}
                  onClick={() => vote()}
                >
                  <img
                    className={styles['vote-icon']}
                    style={{ width: 40, height: 40 }}
                    src={voteIcon}
                  />
                  <span>已点赞</span>
                </div>
              )}
              {!isVote && (
                <div className={styles['vote-button']} onClick={() => vote()}>
                  <img
                    className={styles['vote-icon']}
                    style={{ width: 40, height: 40 }}
                    src={noVoteIcon}
                  />
                  <span>点赞</span>
                </div>
              )}
              {isLike && (
                <div
                  className={styles['active-like-button']}
                  onClick={() => likeHit()}
                >
                  <img
                    className={styles['like-icon']}
                    style={{ width: 40, height: 40 }}
                    src={likeIcon}
                  />
                  <span>已收藏</span>
                </div>
              )}
              {!isLike && (
                <div
                  className={styles['like-button']}
                  onClick={() => likeHit()}
                >
                  <img
                    className={styles['like-icon']}
                    style={{ width: 40, height: 40 }}
                    src={noLikeIcon}
                  />
                  <span>收藏</span>
                </div>
              )}
            </div>
          )} */}
        </div>
      </div>
    </>
  )
}

export default TopicDetailPage
