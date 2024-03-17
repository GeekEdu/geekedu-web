/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:55:05
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-17 15:30:58
 * @FilePath: /geekedu-web/src/pages/wenda/detail.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from 'react'
import { Button, Col, Input, Skeleton, message } from 'antd'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { wenda } from '../../api/index'
import { Empty, ImagePreview, UploadWendaImagesComp } from '../../components'
import { changeTime, getCommentTime, latexRender } from '../../utils/index'
import questionIcon from '../../assets/img/commen/icon-question.png'
import defaultAvatar from '../../assets/img/commen/default-avatar.jpg'
import idoptIcon from '../../assets/img/commen/icon-adopt.png'
import likeIcon from '../../assets/img/commen/icon-like-h.png'
import noLikeIcon from '../../assets/img/commen/icon-like.png'
import styles from './detail.module.scss'

function WendaDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const [loading, setLoading] = useState<boolean>(true)
  const [question, setQuestion] = useState<any>({})
  const [answers, setAnswers] = useState<any>([])
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isVote, setIsVote] = useState<boolean>(false)
  const [images, setImages] = useState<any>([])
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true)
  const [preVisiable, setPreVisiable] = useState<boolean>(false)
  const [imgSrc, setImgSrc] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [configkey, setConfigkey] = useState<any>([])
  const [replyContent, setReplyContent] = useState<string>('')
  const [replyAnswers, setReplyAnswers] = useState<any>([])
  const [commentId, setCommentId] = useState<number>(0)
  const [answerId, setAnswerId] = useState(0)
  const [configInput, setConfigInput] = useState<any>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10000)
  const [total, setTotal] = useState(0)
  const [id, setId] = useState(Number(params.courseId))
  const [commentLoading, setCommentLoading] = useState<boolean>(true)
  const [refresh, setRefresh] = useState(false)
  const user = useSelector((state: any) => state.loginUser.value.user)
  const isLogin = useSelector((state: any) => state.loginUser.value.isLogin)

  useEffect(() => {
    getData()
  }, [id])

  useEffect(() => {
    setId(Number(params.courseId))
  }, [params.courseId])

  useEffect(() => {
    latexRender(document.getElementById('desc'))
  }, [document.getElementById('desc')])

  const getData = () => {
    wenda.detail(id).then((res: any) => {
      document.title = res.data.question.title
      setQuestion(res.data.question)
      setAnswers(res.data.answer)
      setIsAdmin(res.data.isMaster)
      setIsVote(res.data.isThumb)
      setLoading(false)
      setCommentLoading(false)
    })
  }

  const submitComment = () => {
    if (commentLoading)
      return

    if (content === '')
      return

    setCommentLoading(true)
    wenda
      .submitAnswer(id, {
        // original_content: content,
        content,
        images,
      })
      .then((res: any) => {
        setContent('')
        setImages([])
        setRefresh(!refresh)
        message.success('评论成功')
        setCommentLoading(false)
        getData()
      })
      .catch((e) => {
        setCommentLoading(false)
      })
  }

  const questionVote = (answerItem: any, index: number) => {
    if (!isLogin) {
      goLogin()
      return
    }
    if (!answerItem.user)
      return

    wenda
      .vote({
        relationId: answerItem.id,
        type: 'QA_COMMENT',
      })
      .then((res: any) => {
        const value = res.data
        setIsVote(value)
        if (answerItem.isThumb) {
          const data = [...answers]
          data[index].thumbCount--
          data[index].isThumb = false
          setAnswers(data)
          message.success('取消点赞')
        }
        else {
          const data = [...answers]
          data[index].thumbCount++
          data[index].isThumb = true
          setAnswers(data)
          message.success('已点赞')
        }
      })
  }

  const showReply = (id: number) => {
    if (!isLogin) {
      goLogin()
      return
    }
    const arr = []
    arr[id] = true
    setReplyContent('')
    setConfigInput(arr)
    setConfigkey([])
  }

  const getAnswer = (index: number, id: number) => {
    if (id === 0)
      return

    const keys: any = []
    keys[index] = !keys[index]
    setConfigkey(keys)
    setReplyContent('')
    setConfigInput([])
    setCommentId(id)
    wenda
      .answerComments(id, {
        pageNum: page,
        pageSize: size,
      })
      .then((res: any) => {
        const arr1 = [...replyAnswers]
        arr1[index] = res.data.data
        setReplyAnswers(arr1)
      })
  }
  const reply = (id: number, userId: any, nick_name: string, index: number) => {
    if (commentLoading)
      return

    if (!nick_name) {
      message.error('回复的用户不存在')
      return
    }
    if (!replyContent)
      return

    setAnswerId(id)
    setCommentLoading(true)
    wenda
      .submitComment(id, {
        // original_content: replyContent,
        content: replyContent,
        userId,
      })
      .then((res: any) => {
        setConfigInput([])
        message.success('回复成功')
        let item
        if (userId) {
          item = {
            id: res.data,
            parentId: id,
            content: replyContent,
            childrenCount: 0,
            replyComment: {
              user: { name: nick_name },
            },
            createdTime: '刚刚',
            user: {
              avatar: user.avatar,
              name: user.name,
            },
          }
        }
        else {
          item = {
            id: res.data,
            parentId: id,
            content: replyContent,
            childrenCount: 0,
            replyComment: null,
            createdTime: '刚刚',
            user: {
              avatar: user.avatar,
              name: user.name,
            },
          }
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
        const ant = [...answers]
        answers[index].commentCount = Number(answers[index].commentCount) + 1
        setAnswers(ant)
        setReplyContent('')
        setCommentLoading(false)
      })
      .catch((e: any) => {
        setCommentLoading(false)
      })
  }

  const goLogin = () => {
    const url = encodeURIComponent(
      window.location.pathname + window.location.search,
    )
    navigate(`/login?redirect=${url}`)
  }

  const setCorrect = (answer: any) => {
    if (!answer.user)
      return

    wenda
      .choiceAnswer(question.id, answer.id)
      .then(() => {
        message.success('成功')
        getData()
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
                  navigate('/wenda')
                }}
              >
                问答社区
              </a>
              {' '}
              /
              <span>{question.title}</span>
            </>
          )}
        </div>
        {preVisiable && (
          <ImagePreview
            url={imgSrc}
            close={() => setPreVisiable(false)}
          >
          </ImagePreview>
        )}
        {loading && (
          <div className={styles['question-body']}>
            <Skeleton.Button
              active
              style={{
                width: 1140,
                height: 34,
                marginBottom: 25,
              }}
            >
            </Skeleton.Button>
            <Skeleton.Button
              active
              style={{
                width: 1140,
                height: 26,
                marginBottom: 30,
              }}
            >
            </Skeleton.Button>
            <Skeleton.Button
              active
              style={{
                width: 1140,
                height: 14,
              }}
            >
            </Skeleton.Button>
          </div>
        )}
        {!loading && (
          <div className={styles['question-body']}>
            {question.rewardScore > 0 && (
              <div className={styles.credit}>
                悬赏：
                {question.rewardScore}
                积分
              </div>
            )}
            <div className={styles.title}>
              <div className={styles.icon}>
                <img src={questionIcon} />
              </div>
              <div className={styles.tit}>{question.title}</div>
            </div>
            <div className={styles['question-content']}>
              <div
                dangerouslySetInnerHTML={{ __html: question.content }}
              >
              </div>
            </div>
            {question.imagesList && question.imagesList.length > 0 && (
              <div className={styles['thumbs-box']}>
                {question.imagesList.map((imgItem: any, index: number) => (
                  <div key={index} className={styles['thumb-item']}>
                    <div
                      className={styles['image-view']}
                      style={{ backgroundImage: `url(${imgItem})` }}
                      onClick={() => {
                        setImgSrc(imgItem)
                        setPreVisiable(true)
                      }}
                    >
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.stat}>
              <span className={styles.datetime}>
                {changeTime(question.createdTime)}
              </span>
              <span className={styles['view-times']}>
                {question.viewCount}
                次浏览
              </span>
              <span className={styles['answer-count']}>
                {question.answerCount}
                回答
              </span>
              {question.user && (
                <span className={styles['send-addr']}>
                  发表于：
                  {question.user.province}
                </span>
              )}
            </div>
          </div>
        )}
        <div className={styles['comments-box']}>
          {!loading && isLogin && question.status !== 1 && (
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
                placeholder="此处填写你的回答"
              >
              </Input>
              {content === '' && (
                <Button className={styles['disabled-button']}>发布回答</Button>
              )}
              {content !== '' && (
                <Button
                  type="primary"
                  loading={commentLoading}
                  className={styles['confirm-button']}
                  onClick={() => submitComment()}
                >
                  发布回答
                </Button>
              )}
              <div className={styles['upload-body']}>
                <UploadWendaImagesComp
                  open={isUploadShow}
                  fresh={refresh}
                  onUpdate={(thumbs: any[]) => {
                    setImages(thumbs)
                  }}
                >
                </UploadWendaImagesComp>
              </div>
            </div>
          )}
          <div className={styles['comment-divider']}>全部回答</div>
          <div className={styles.line}></div>
          <div className={styles['comments-list-box']}>
            {commentLoading && (
              <div
                style={{
                  width: 1140,
                  marginTop: 50,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 1140,
                      height: 48,
                      marginBottom: 30,
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    <Skeleton.Avatar
                      active
                      size={48}
                      style={{
                        marginRight: 30,
                      }}
                    >
                    </Skeleton.Avatar>
                    <div
                      style={{
                        width: 960,
                        height: 48,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Skeleton.Button
                        active
                        style={{
                          width: 960,
                          height: 14,
                          marginTop: 3,
                          marginBottom: 16,
                        }}
                      >
                      </Skeleton.Button>
                      <Skeleton.Button
                        active
                        style={{
                          width: 960,
                          height: 14,
                        }}
                      >
                      </Skeleton.Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!commentLoading && answers.length === 0 && (
              <Col span={24}>
                <Empty></Empty>
              </Col>
            )}
            {!commentLoading
            && answers.length > 0
            && answers.map((item: any, index: number) => (
              <div className={styles['comment-item']} key={item.id}>
                <div className={styles.avatar}>
                  {item.user && <img src={item.user.avatar} />}
                  {!item.user && <img src={defaultAvatar} />}
                </div>
                <div className={styles['comment-content']}>
                  <div className={styles['top-info']}>
                    {!item.user && (
                      <div className={styles.nickname}>未知用户</div>
                    )}
                    {item.user && (
                      <div className={styles.nickname}>
                        {item.user.name}
                      </div>
                    )}
                    <div className={styles.diff}>
                      {getCommentTime(item.createdTime)}
                    </div>
                    {item.user && (
                      <div className={styles['user-address']}>
                        地区：
                        {item.user.province}
                      </div>
                    )}
                    {item.isCorrect && (
                      <div className={styles['correct-answer']}>
                        <img src={idoptIcon} />
                        此回答已被题主采纳
                      </div>
                    )}
                  </div>
                  <div
                    className={styles.text}
                    id="desc"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  >
                  </div>
                  {item.imagesList.length > 0 && (
                    <div className={styles.thumbs}>
                      {item.imagesList.map((imgItem: any, index: number) => (
                        <div key={index} className={styles['img-item']}>
                          <div
                            className={styles['image-view']}
                            style={{
                              backgroundImage: `url(${imgItem})`,
                            }}
                            onClick={() => {
                              setImgSrc(imgItem)
                              setPreVisiable(true)
                            }}
                          >
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={styles['reply-answer-box']}>
                    <div
                      className={
                          item.isThumb
                            ? styles['act-vote-button']
                            : styles['vote-button']
                        }
                      onClick={() => questionVote(item, index)}
                    >
                      {item.isThumb && <img src={likeIcon} />}
                      {!item.isThumb && <img src={noLikeIcon} />}
                      {item.thumbCount}
                    </div>
                    {item.commentCount !== 0 && (
                      <div
                        className={
                            configkey[index] === true
                              ? styles['reply-trans-answer']
                              : styles['reply-answer']
                          }
                        onClick={() => getAnswer(index, item.id)}
                      >
                        {item.commentCount}
                        回复
                      </div>
                    )}
                    {item.commentCount === 0 && item.user && (
                      <div
                        className={
                            configInput[index] === true
                              ? styles['reply-trans-answer']
                              : styles['reply-answer']
                          }
                        onClick={() => showReply(index)}
                      >
                        回复
                      </div>
                    )}
                  </div>
                  {(configkey[index] === true
                  || configInput[index] === true) && (
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
                        <Button className={styles['disabled-button']}>
                          发表回复
                        </Button>
                      )}
                      {replyContent !== '' && (
                        <Button
                          type="primary"
                          className={styles['confirm-button']}
                          onClick={() =>
                            reply(item.id, item.user.userId, item.user.name, index)}
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
                            {replyItem.user && (
                              <img src={replyItem.user.avatar} />
                            )}
                            {!replyItem.user && <img src={defaultAvatar} />}
                          </div>
                          <div className={styles['reply-content']}>
                            <div className={styles['top-info']}>
                              {!replyItem.user && (
                                <div
                                  className={styles['red-reply-nickname']}
                                >
                                  未知用户
                                </div>
                              )}
                              {replyItem.user && (
                                <div className={styles['reply-nickname']}>
                                  <>
                                    {replyItem.user.name}
                                    {replyItem?.reply_user_id > 0 && (
                                      <>
                                        回复：
                                        {replyItem?.reply_user.name}
                                      </>
                                    )}
                                  </>
                                </div>
                              )}
                              <div className={styles['reply-diff']}>
                                {getCommentTime(replyItem.createdTime)}
                              </div>
                            </div>
                            <div
                              className={styles['reply-text']}
                              dangerouslySetInnerHTML={{
                                __html: replyItem.content,
                              }}
                            >
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!question.questionStatus
                  && isAdmin
                  && item.userId !== question.userId && (
                    <div
                      className={styles['set-correct']}
                      onClick={() => setCorrect(item)}
                    >
                      采纳此回答
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default WendaDetailPage
