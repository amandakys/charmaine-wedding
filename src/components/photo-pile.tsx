"use client"

/* eslint-disable @next/next/no-img-element */
import * as React from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { cn } from "@/lib/utils"

const CORNERS = [
  { startX: -800, startY: -500 },
  { startX: 800, startY: -500 },
  { startX: -800, startY: 500 },
  { startX: 800, startY: 500 },
]

function getPileTransform(index: number, total: number) {
  const seed = index * 7 + 3
  const rotate = ((seed * 13) % 21) - 10
  const offsetX = ((seed * 17) % 200) - 100
  const offsetY = ((seed * 11) % 80) - 40
  return { rotate, offsetX, offsetY }
}

interface PhotoPileProps {
  images: { src: string; alt: string }[]
  className?: string
}

export function PhotoPile({ images, className }: PhotoPileProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end end"],
  })

  return (
    <div
      ref={scrollRef}
      className={cn("relative", className)}
      style={{ height: `${images.length * 18 + 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/floral-pattern.png)`, backgroundRepeat: "repeat", backgroundSize: "400px", maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)" }}
        />
        {images.map((image, i) => (
          <PileItem
            key={image.src}
            src={image.src}
            alt={image.alt}
            index={i}
            total={images.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  )
}

interface PileItemProps {
  src: string
  alt: string
  index: number
  total: number
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
}

function PileItem({ src, alt, index, total, scrollYProgress }: PileItemProps) {
  const { rotate, offsetX, offsetY } = getPileTransform(index, total)
  const corner = CORNERS[index % 4]

  // Each image flies in sequentially — next starts only after previous lands
  const flyDuration = 0.03
  const startOffset = 0.3
  const appearAt = startOffset + index * flyDuration
  const landAt = appearAt + flyDuration

  const x = useTransform(
    scrollYProgress,
    [appearAt, landAt, 1],
    [corner.startX, offsetX, offsetX]
  )
  const y = useTransform(
    scrollYProgress,
    [appearAt, landAt, 1],
    [corner.startY, offsetY, offsetY]
  )

  return (
    <motion.div
      className="absolute rounded-lg overflow-hidden shadow-xl"
      style={{
        x,
        y,
        rotate,
        width: "clamp(300px, 40vw, 560px)",
        zIndex: index,
      }}
    >
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`}
        alt={alt}
        className="w-full h-auto"
      />
    </motion.div>
  )
}
