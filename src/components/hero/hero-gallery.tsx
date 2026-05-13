"use client"

import * as React from "react"
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "motion/react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { useScrollIdle } from "@/hooks/use-scroll-idle"
import { FloatingLayer, FloatingElement } from "./floating-layer"

interface ScrollContextValue {
  scrollYProgress: MotionValue<number>
}

const ScrollContext = React.createContext<ScrollContextValue | undefined>(
  undefined
)

function useScrollContext() {
  const context = React.useContext(ScrollContext)
  if (!context) {
    throw new Error("useScrollContext must be used within HeroGallery")
  }
  return context
}

interface HeroGalleryProps {
  images: { src: string; alt: string }[]
  title?: React.ReactNode
  className?: string
}

export function HeroGallery({ images, title, className }: HeroGalleryProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: scrollRef })
  const isIdle = useScrollIdle(200)

  return (
    <ScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-[200vh] w-full", className)}
      >
        {title && <HeroTitle>{title}</HeroTitle>}

        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <FloatingLayer active={isIdle} sensitivity={0.8} easingFactor={0.02}>
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-[1fr_0.5fr_0.5fr_1fr] gap-3 p-4 md:p-8">
              {images.slice(0, 5).map((image, i) => (
                <GalleryCell
                  key={image.src}
                  className={cn(
                    i === 0 &&
                      "col-span-8 md:col-span-6 row-span-3 origin-top-right",
                    i === 1 &&
                      "col-span-2 row-span-2 hidden md:block",
                    i === 2 &&
                      "col-span-2 row-span-2 hidden md:block origin-bottom-right",
                    i === 3 &&
                      "col-span-4 md:col-span-3 origin-top-right",
                    i === 4 && "col-span-4 md:col-span-3"
                  )}
                  depth={[1.5, 2.5, 3, 2, 1.8][i]}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover rounded-lg"
                    sizes={
                      i === 0
                        ? "(max-width: 768px) 100vw, 75vw"
                        : "(max-width: 768px) 50vw, 37vw"
                    }
                    priority={i === 0}
                  />
                </GalleryCell>
              ))}
            </div>
          </FloatingLayer>
        </div>
      </div>
    </ScrollContext.Provider>
  )
}

function HeroTitle({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScrollContext()
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.8])
  const position = useTransform(scrollYProgress, (pos) =>
    pos >= 0.5 ? "absolute" : ("fixed" as "absolute" | "fixed")
  )

  return (
    <motion.div
      className="left-1/2 top-1/2 z-10 text-center pointer-events-none"
      style={{
        translate: "-50% -50%",
        scale,
        position,
        opacity,
      }}
    >
      {children}
    </motion.div>
  )
}

interface GalleryCellProps {
  children: React.ReactNode
  className?: string
  depth?: number
}

function GalleryCell({ children, className, depth = 1 }: GalleryCellProps) {
  const { scrollYProgress } = useScrollContext()
  const translate = useTransform(scrollYProgress, [0.05, 0.85], ["-30%", "0%"])
  const scale = useTransform(scrollYProgress, [0, 0.85], [0.6, 1])

  return (
    <FloatingElement className={cn("!relative", className)} depth={depth}>
      <motion.div
        className="relative w-full h-full overflow-hidden rounded-lg"
        style={{ translate, scale }}
      >
        {children}
      </motion.div>
    </FloatingElement>
  )
}
