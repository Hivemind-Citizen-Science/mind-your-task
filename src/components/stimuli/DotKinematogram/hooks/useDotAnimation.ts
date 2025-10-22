import { useState, useEffect, useRef } from 'react'
import { Dot } from '../types'

interface UseDotAnimationProps {
  coherence: number
  direction: 'left' | 'right'
  dotCount: number
  apertureSize: number
  duration: number
  isActive: boolean
}

export const useDotAnimation = ({
  coherence,
  direction,
  dotCount,
  apertureSize,
  duration,
  isActive
}: UseDotAnimationProps) => {
  const [dots, setDots] = useState<Dot[]>([])
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!isActive) {
      setDots([])
      return
    }

    startTimeRef.current = Date.now()
    
    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTimeRef.current
      
      if (elapsed >= duration) {
        setDots([])
        return
      }

      // Generate new dots each frame
      const newDots: Dot[] = []
      const velocity = direction === 'left' ? -5 : 5
      
      for (let i = 0; i < dotCount; i++) {
        const isCoherent = Math.random() * 100 < coherence
        
        if (isCoherent) {
          // Coherent motion in the specified direction
          newDots.push({
            id: `${i}-${elapsed}`,
            x: Math.random() * apertureSize,
            y: Math.random() * apertureSize,
            vx: velocity,
            vy: 0
          })
        } else {
          // Random motion
          const angle = Math.random() * 2 * Math.PI
          const speed = 3 + Math.random() * 4 // Random speed between 3-7
          newDots.push({
            id: `${i}-${elapsed}`,
            x: Math.random() * apertureSize,
            y: Math.random() * apertureSize,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed
          })
        }
      }
      
      setDots(newDots)
      
      if (elapsed < duration) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [coherence, direction, dotCount, apertureSize, duration, isActive])

  return dots
}
