"use client"

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react"
import { useAnimationFrame } from "motion/react"

import { cn } from "@/lib/utils"
import { useMousePositionRef } from "@/hooks/use-mouse-position-ref"

interface FloatingContextType {
  registerElement: (id: string, element: HTMLDivElement, depth: number) => void
  unregisterElement: (id: string) => void
  setActive: (active: boolean) => void
}

const FloatingContext = createContext<FloatingContextType | null>(null)

interface FloatingLayerProps {
  children: ReactNode
  className?: string
  sensitivity?: number
  easingFactor?: number
  active?: boolean
}

export function FloatingLayer({
  children,
  className,
  sensitivity = 1,
  easingFactor = 0.03,
  active = true,
}: FloatingLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(active)
  const elementsMap = useRef(
    new Map<
      string,
      {
        element: HTMLDivElement
        depth: number
        currentPosition: { x: number; y: number }
      }
    >()
  )
  const mousePositionRef = useMousePositionRef(containerRef)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  const registerElement = useCallback(
    (id: string, element: HTMLDivElement, depth: number) => {
      elementsMap.current.set(id, {
        element,
        depth,
        currentPosition: { x: 0, y: 0 },
      })
    },
    []
  )

  const unregisterElement = useCallback((id: string) => {
    elementsMap.current.delete(id)
  }, [])

  const setActive = useCallback((a: boolean) => {
    activeRef.current = a
  }, [])

  useAnimationFrame(() => {
    if (!containerRef.current) return

    elementsMap.current.forEach((data) => {
      const strength = (data.depth * sensitivity) / 20

      let targetX: number
      let targetY: number

      if (activeRef.current) {
        targetX = mousePositionRef.current.x * strength
        targetY = mousePositionRef.current.y * strength
      } else {
        targetX = 0
        targetY = 0
      }

      const dx = targetX - data.currentPosition.x
      const dy = targetY - data.currentPosition.y

      data.currentPosition.x += dx * easingFactor
      data.currentPosition.y += dy * easingFactor

      data.element.style.transform = `translate3d(${data.currentPosition.x}px, ${data.currentPosition.y}px, 0)`
    })
  })

  return (
    <FloatingContext.Provider
      value={{ registerElement, unregisterElement, setActive }}
    >
      <div
        ref={containerRef}
        className={cn("absolute inset-0 w-full h-full", className)}
      >
        {children}
      </div>
    </FloatingContext.Provider>
  )
}

interface FloatingElementProps {
  children: ReactNode
  className?: string
  depth?: number
}

export function FloatingElement({
  children,
  className,
  depth = 1,
}: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(Math.random().toString(36).substring(7))
  const context = useContext(FloatingContext)

  useEffect(() => {
    if (!elementRef.current || !context) return
    context.registerElement(idRef.current, elementRef.current, depth)
    return () => context.unregisterElement(idRef.current)
  }, [depth, context])

  return (
    <div ref={elementRef} className={cn("absolute will-change-transform", className)}>
      {children}
    </div>
  )
}
