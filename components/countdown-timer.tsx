"use client"

import { useState, useEffect } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const targetDate = new Date("2025-06-17T12:00:00-07:00").getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
        setIsExpired(false)
      } else {
        setIsExpired(true)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (isExpired) {
    return <div className="text-center text-white/50 text-sm">Competition ended</div>
  }

  return (
    <div className="text-center">
      <div className="text-white/50 text-sm mb-2">Deadline: June 17, 2025 • 12:00 PM PDT</div>
      <div className="flex justify-center gap-6 text-white/70">
        <div className="text-center">
          <div className="text-lg font-medium">{timeLeft.days}</div>
          <div className="text-xs text-white/40">days</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-medium">{timeLeft.hours}</div>
          <div className="text-xs text-white/40">hrs</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-medium">{timeLeft.minutes}</div>
          <div className="text-xs text-white/40">min</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-medium">{timeLeft.seconds}</div>
          <div className="text-xs text-white/40">sec</div>
        </div>
      </div>
    </div>
  )
}
