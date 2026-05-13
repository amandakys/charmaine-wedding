"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PinnedVideoProps {
  src: string
  className?: string
}

export function PinnedVideo({ src, className }: PinnedVideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = false
          video.play().catch(() => {
            video.muted = true
            video.play()
          })
        } else {
          video.pause()
        }
      },
      { threshold: 0.95 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={cn("relative h-[200vh]", className)}>
      <div className="sticky top-0 h-screen flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`}
          loop
          playsInline
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  )
}
