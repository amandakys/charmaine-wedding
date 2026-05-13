"use client"

import { useEffect, useRef, useState } from "react"

export function useScrollIdle(timeout = 150) {
  const [isIdle, setIsIdle] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsIdle(false)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setIsIdle(true), timeout)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timeout])

  return isIdle
}
