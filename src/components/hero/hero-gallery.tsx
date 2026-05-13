"use client"

/* eslint-disable @next/next/no-img-element */
import * as React from "react"
import { motion, useScroll, useTransform, MotionValue } from "motion/react"

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

const SCATTER_POSITIONS: { top: string; left: string; rotate: number; size: string }[] = [
  { top: "5%", left: "8%", rotate: -12, size: "18vw" },
  { top: "12%", left: "55%", rotate: 8, size: "15vw" },
  { top: "60%", left: "3%", rotate: 5, size: "14vw" },
  { top: "45%", left: "75%", rotate: -6, size: "16vw" },
  { top: "8%", left: "80%", rotate: 14, size: "13vw" },
  { top: "70%", left: "60%", rotate: -10, size: "15vw" },
  { top: "35%", left: "20%", rotate: 7, size: "12vw" },
  { top: "80%", left: "35%", rotate: -4, size: "14vw" },
  { top: "25%", left: "42%", rotate: 11, size: "11vw" },
  { top: "55%", left: "45%", rotate: -8, size: "13vw" },
  { top: "15%", left: "30%", rotate: -5, size: "16vw" },
  { top: "40%", left: "60%", rotate: 9, size: "14vw" },
  { top: "75%", left: "15%", rotate: -7, size: "12vw" },
  { top: "30%", left: "85%", rotate: 6, size: "11vw" },
  { top: "65%", left: "85%", rotate: -13, size: "13vw" },
]

interface HeroGalleryProps {
  images: { src: string; alt: string }[]
  bentoCount?: number
  title?: React.ReactNode
  className?: string
}

export function HeroGallery({
  images,
  bentoCount = 5,
  title,
  className,
}: HeroGalleryProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: scrollRef })
  const isIdle = useScrollIdle(200)

  const bentoImages = images.slice(0, bentoCount)
  const floatingImages = images.slice(bentoCount, 15)

  return (
    <ScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-[250vh] w-full", className)}
      >
        {title && <HeroTitle>{title}</HeroTitle>}

        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <FloatingLayer active={isIdle} sensitivity={0.8} easingFactor={0.02}>
            {/* Background floating images — fade out on scroll */}
            {floatingImages.map((image, i) => (
              <ScatteredImage
                key={`bg-${i}`}
                src={image.src}
                alt={image.alt}
                position={SCATTER_POSITIONS[i + bentoCount]}
                depth={1 + (i % 3) * 0.8}
                index={i}
              />
            ))}

            {/* Bento grid images — scale into grid on scroll */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-[1fr_0.5fr_0.5fr_1fr] gap-3 p-4 md:p-8">
              {bentoImages.map((image, i) => (
                <BentoCell
                  key={image.src}
                  className={cn(
                    i === 0 &&
                      "col-span-8 md:col-span-6 row-span-3 origin-top-right",
                    i === 1 && "col-span-2 row-span-2 hidden md:block",
                    i === 2 &&
                      "col-span-2 row-span-2 hidden md:block origin-bottom-right",
                    i === 3 && "col-span-4 md:col-span-3 origin-top-right",
                    i === 4 && "col-span-4 md:col-span-3"
                  )}
                  depth={[1.5, 2.5, 3, 2, 1.8][i]}
                >
                  <img
                    src={`/charmaine-wedding${image.src}`}
                    alt={image.alt}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                </BentoCell>
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
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])
  const position = useTransform(scrollYProgress, (pos) =>
    pos >= 0.4 ? "absolute" : ("fixed" as "absolute" | "fixed")
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

interface ScatteredImageProps {
  src: string
  alt: string
  position: { top: string; left: string; rotate: number; size: string }
  depth: number
  index: number
}

function ScatteredImage({ src, alt, position, depth, index }: ScatteredImageProps) {
  const { scrollYProgress } = useScrollContext()

  const opacity = useTransform(scrollYProgress, [0.05, 0.35], [1, 0])
  const scale = useTransform(scrollYProgress, [0.05, 0.35], [1, 0.3])
  const x = useTransform(
    scrollYProgress,
    [0.05, 0.4],
    ["0%", `${index % 2 === 0 ? -120 : 120}%`]
  )

  if (!position) return null

  return (
    <FloatingElement
      className="z-0"
      depth={depth}
    >
      <motion.div
        className="rounded-lg overflow-hidden shadow-2xl"
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
          width: position.size,
          aspectRatio: "3/4",
          rotate: position.rotate,
          opacity,
          scale,
          x,
        }}
      >
        <img
          src={`/charmaine-wedding${src}`}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </FloatingElement>
  )
}

interface BentoCellProps {
  children: React.ReactNode
  className?: string
  depth?: number
}

function BentoCell({ children, className, depth = 1 }: BentoCellProps) {
  const { scrollYProgress } = useScrollContext()
  const translate = useTransform(scrollYProgress, [0.1, 0.8], ["-35%", "0%"])
  const scale = useTransform(scrollYProgress, [0.05, 0.8], [0.5, 1])
  const opacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1])

  return (
    <FloatingElement className={cn("!relative", className)} depth={depth}>
      <motion.div
        className="relative w-full h-full overflow-hidden rounded-lg"
        style={{ translate, scale, opacity }}
      >
        {children}
      </motion.div>
    </FloatingElement>
  )
}
