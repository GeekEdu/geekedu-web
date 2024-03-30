import React, { useEffect, useState } from 'react'

interface PropInterface {
  seconds: number
}

export const DurationText: React.FC<PropInterface> = ({ seconds }) => {
  const [hour, setHour] = useState('')
  const [minute, setMinute] = useState<string | number>('')
  const [second, setSecond] = useState<string | number>('')

  useEffect(() => {
    const h = Math.floor(seconds / 3600)
    if (h === 0)
      setHour('')
    else
      setHour(h >= 10 ? `${h}:` : `0${h}:`)

    const m = Math.floor((seconds % 3600) / 60)
    setMinute(m >= 10 ? m : `0${m}`)

    const s = Math.floor((seconds % 3600) % 60)
    setSecond(s >= 10 ? s : `0${s}`)
  }, [seconds])

  return (
    <>
      <span>
        {hour}
        {minute}
        :
        {second}
      </span>
    </>
  )
}
