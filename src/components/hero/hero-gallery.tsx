"use client"

/* eslint-disable @next/next/no-img-element */
import * as React from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { cn } from "@/lib/utils"

const GRID_TWEAKS: { rotate: number; offsetX: number; offsetY: number }[] = [
  { rotate: -4, offsetX: -5, offsetY: 3 },
  { rotate: 3, offsetX: 8, offsetY: -4 },
  { rotate: -2, offsetX: -3, offsetY: 6 },
  { rotate: 5, offsetX: 4, offsetY: -2 },
  { rotate: -3, offsetX: -6, offsetY: 5 },
  { rotate: 4, offsetX: 7, offsetY: -3 },
  { rotate: 5, offsetX: 6, offsetY: -5 },
  { rotate: -5, offsetX: -4, offsetY: 4 },
  { rotate: 2, offsetX: 5, offsetY: -6 },
  { rotate: -4, offsetX: -7, offsetY: 3 },
  { rotate: 6, offsetX: 3, offsetY: -4 },
  { rotate: -3, offsetX: -5, offsetY: 7 },
  { rotate: -6, offsetX: 4, offsetY: -3 },
  { rotate: 4, offsetX: -6, offsetY: 5 },
  { rotate: -2, offsetX: 7, offsetY: -4 },
  { rotate: 5, offsetX: -3, offsetY: 6 },
  { rotate: -4, offsetX: 5, offsetY: -5 },
  { rotate: 3, offsetX: -4, offsetY: 3 },
  { rotate: 3, offsetX: -5, offsetY: -4 },
  { rotate: -5, offsetX: 6, offsetY: 5 },
  { rotate: 4, offsetX: -3, offsetY: -6 },
  { rotate: -3, offsetX: 4, offsetY: 4 },
  { rotate: 6, offsetX: -6, offsetY: -3 },
  { rotate: -4, offsetX: 5, offsetY: 6 },
  { rotate: -3, offsetX: 7, offsetY: -5 },
  { rotate: 5, offsetX: -4, offsetY: 3 },
  { rotate: -6, offsetX: 3, offsetY: -4 },
  { rotate: 4, offsetX: -5, offsetY: 6 },
  { rotate: -2, offsetX: 6, offsetY: -3 },
  { rotate: 3, offsetX: -3, offsetY: 5 },
  { rotate: 4, offsetX: -4, offsetY: -6 },
  { rotate: -5, offsetX: 5, offsetY: 4 },
  { rotate: 3, offsetX: -6, offsetY: -3 },
  { rotate: -4, offsetX: 4, offsetY: 5 },
  { rotate: 5, offsetX: -5, offsetY: -4 },
  { rotate: -3, offsetX: 6, offsetY: 3 },
]

interface HeroGalleryProps {
  images: { src: string; alt: string; isBento?: boolean }[]
  className?: string
}

export function HeroGallery({ images, className }: HeroGalleryProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  })

  const bentoImages = images.filter((img) => img.isBento)
  const bentoIndices = images.reduce<number[]>((acc, img, i) => {
    if (img.isBento) acc.push(i)
    return acc
  }, [])

  return (
    <div
      ref={scrollRef}
      className={cn("relative min-h-[250vh] w-full", className)}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-amber-50">
        {/* Full grid with ALL images — no gaps, constrained to viewport */}
        <BackgroundGrid images={images} scrollYProgress={scrollYProgress} />

        {/* Bento images — positioned over their grid cells, animate into bento layout */}
        <ScatteredToBento
          images={bentoImages}
          bentoIndices={bentoIndices}
          totalCount={images.length}
          scrollYProgress={scrollYProgress}
        />
      </div>
    </div>
  )
}


interface BackgroundGridProps {
  images: { src: string; alt: string; isBento?: boolean }[]
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
}

function BackgroundGrid({ images, scrollYProgress }: BackgroundGridProps) {
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.45], [1, 1, 0])
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setVisible(v < 0.46)
    })
    return unsubscribe
  }, [scrollYProgress])

  if (!visible) return null

  return (
    <motion.div
      className="absolute inset-0 grid grid-cols-6 grid-rows-[repeat(6,1fr)] gap-2 p-3"
      style={{ opacity }}
    >
      {images.map((image, i) => {
        const tweak = GRID_TWEAKS[i % GRID_TWEAKS.length]
        if (image.isBento) {
          return <div key={image.src} />
        }
        return (
          <div
            key={image.src}
            className="overflow-hidden rounded-lg shadow-lg w-full h-full"
            style={{
              rotate: `${tweak.rotate}deg`,
              translate: `${tweak.offsetX}px ${tweak.offsetY}px`,
            }}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${image.src}`}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        )
      })}
    </motion.div>
  )
}

interface ScatteredToBentoProps {
  images: { src: string; alt: string }[]
  bentoIndices: number[]
  totalCount: number
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
}

function ScatteredToBento({ images, bentoIndices, totalCount, scrollYProgress }: ScatteredToBentoProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [bentoRects, setBentoRects] = React.useState<DOMRect[]>([])
  const [scatterRects, setScatterRects] = React.useState<DOMRect[]>([])
  const scatterRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const bentoRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const measure = () => {
      if (!bentoRef.current || !containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()

      const bentoEls = bentoRef.current.querySelectorAll("[data-bento-cell]")
      const bRects = Array.from(bentoEls).map((el) => {
        const r = el.getBoundingClientRect()
        return new DOMRect(
          r.left - containerRect.left,
          r.top - containerRect.top,
          r.width,
          r.height
        )
      })
      setBentoRects(bRects)

      const sRects = scatterRefs.current.map((el) => {
        if (!el) return new DOMRect()
        const r = el.getBoundingClientRect()
        return new DOMRect(
          r.left - containerRect.left,
          r.top - containerRect.top,
          r.width,
          r.height
        )
      })
      setScatterRects(sRects)
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [images.length])

  const hasRects = bentoRects.length === images.length && scatterRects.length === images.length

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Hidden bento grid for measuring target positions */}
      <div
        ref={bentoRef}
        className="absolute inset-0 grid grid-cols-8 grid-rows-[1fr_0.5fr_0.5fr_1fr] gap-3 p-4 md:p-8 opacity-0 pointer-events-none"
      >
        {images.map((_, i) => (
          <div
            key={i}
            data-bento-cell
            className={cn(
              i === 0 && "col-span-8 md:col-span-6 row-span-3",
              i === 1 && "col-span-2 row-span-2 hidden md:block",
              i === 2 && "col-span-2 row-span-2 hidden md:block",
              i === 3 && "col-span-4 md:col-span-3",
              i === 4 && "col-span-4 md:col-span-3"
            )}
          />
        ))}
      </div>

      {/* Hidden grid cells for measuring scatter source positions */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-[repeat(6,1fr)] gap-2 p-3 opacity-0 pointer-events-none">
        {Array.from({ length: totalCount }).map((_, i) => {
          const bentoIdx = bentoIndices.indexOf(i)
          if (bentoIdx === -1) return <div key={i} />
          return (
            <div
              key={i}
              ref={(el) => { scatterRefs.current[bentoIdx] = el }}
              className="relative w-full h-full"
            />
          )
        })}
      </div>

      {/* Animated bento images */}
      {hasRects && images.map((image, i) => (
        <AnimatingBentoImage
          key={image.src}
          src={image.src}
          alt={image.alt}
          scatterRect={scatterRects[i]}
          bentoRect={bentoRects[i]}
          tweak={GRID_TWEAKS[bentoIndices[i] % GRID_TWEAKS.length]}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  )
}

interface AnimatingBentoImageProps {
  src: string
  alt: string
  scatterRect: DOMRect
  bentoRect: DOMRect
  tweak: { rotate: number; offsetX: number; offsetY: number }
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"]
}

function AnimatingBentoImage({
  src,
  alt,
  scatterRect,
  bentoRect,
  tweak,
  scrollYProgress,
}: AnimatingBentoImageProps) {
  const left = useTransform(scrollYProgress, [0.15, 0.55], [scatterRect.x + tweak.offsetX, bentoRect.x])
  const top = useTransform(scrollYProgress, [0.15, 0.55], [scatterRect.y + tweak.offsetY, bentoRect.y])
  const width = useTransform(scrollYProgress, [0.15, 0.55], [scatterRect.width, bentoRect.width])
  const height = useTransform(scrollYProgress, [0.15, 0.55], [scatterRect.height, bentoRect.height])
  const rotate = useTransform(scrollYProgress, [0.15, 0.55], [tweak.rotate, 0])

  return (
    <motion.div
      className="absolute overflow-hidden rounded-lg shadow-lg z-10"
      style={{ left, top, width, height, rotate }}
    >
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </motion.div>
  )
}
