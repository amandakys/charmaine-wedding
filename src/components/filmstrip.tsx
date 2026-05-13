"use client"

/* eslint-disable @next/next/no-img-element */
import * as React from "react"
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react"
import { cn } from "@/lib/utils"

interface FilmstripProps {
  images: { src: string; alt: string }[]
  className?: string
}

export function Filmstrip({ images, className }: FilmstripProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const stripRef = React.useRef<HTMLDivElement>(null)
  const [translateEnd, setTranslateEnd] = React.useState(-2000)

  React.useEffect(() => {
    function measure() {
      const strip = stripRef.current
      if (!strip) return
      const children = Array.from(strip.children) as HTMLElement[]
      if (children.length < 2) return
      // We want the second-to-last image (the real last image) centered
      const lastReal = children[children.length - 2]
      const stripRect = strip.getBoundingClientRect()
      const lastRect = lastReal.getBoundingClientRect()
      const viewportCenter = window.innerWidth / 2
      const lastCenter = lastRect.left - stripRect.left + lastRect.width / 2
      setTranslateEnd(-(lastCenter - viewportCenter))
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [images])

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, translateEnd])

  // Calculate scroll height based on number of images
  const scrollHeight = `${Math.max(200, images.length * 50)}vh`

  return (
    <div
      ref={scrollRef}
      className={cn("relative", className)}
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center gap-3 overflow-hidden">
        <div className="flex-shrink-0 w-full h-32 opacity-40" style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/border-vine.png)`, backgroundRepeat: "repeat-x", backgroundSize: "auto 100%" }} />
        <div className="flex items-center overflow-hidden">
          <motion.div
            ref={stripRef}
            className="flex gap-4 px-8"
            style={{ x }}
          >
            {images.map((image) => (
              <div
                key={image.src}
                className="relative h-[60vh] flex-shrink-0 rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${image.src}`}
                  alt={image.alt}
                  className="h-full w-auto object-cover"
                />
              </div>
            ))}
            {/* Placeholder: first image repeated at the end */}
            <div className="relative h-[60vh] flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${images[0].src}`}
                alt={images[0].alt}
                className="h-full w-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
        <div className="flex-shrink-0 w-full h-32 opacity-40" style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/border-vine.png)`, backgroundRepeat: "repeat-x", backgroundSize: "auto 100%", transform: "scaleY(-1)" }} />
      </div>
    </div>
  )
}
