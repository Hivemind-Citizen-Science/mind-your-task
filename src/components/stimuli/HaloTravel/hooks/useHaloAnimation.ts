import { useState, useEffect, useRef } from 'react'
import { Dimensions } from 'react-native'
import { HaloAnimationState, HaloProps } from '../types'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface UseHaloAnimationProps {
  correctAnswer: 'A' | 'B'
  haloSize: number
  travelSpeed: number
  distanceDifference: number
  duration: number
  isActive: boolean
}

interface UseHaloAnimationReturn {
  phase: 'A' | 'B' | 'complete'
  haloA: Omit<HaloProps, 'color'>
  haloB: Omit<HaloProps, 'color'>
}

export const useHaloAnimation = ({
  correctAnswer,
  haloSize,
  travelSpeed,
  distanceDifference,
  duration,
  isActive
}: UseHaloAnimationProps): UseHaloAnimationReturn => {
  const [animationState, setAnimationState] = useState<HaloAnimationState>({
    phase: 'A',
    phaseStartTime: 0,
    haloPosition: { x: 0, y: screenHeight / 2 - 100 }
  })
  
  const [haloPositions, setHaloPositions] = useState({
    haloA: { x: -haloSize, y: screenHeight / 2 - 100 },
    haloB: { x: -haloSize, y: screenHeight / 2 - 100 }
  })
  
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!isActive) return

    const startTime = Date.now()
    setAnimationState(prev => ({
      ...prev,
      phaseStartTime: startTime
    }))

    // Phase A: Show halo A for half the duration
    const phaseADuration = duration / 2
    const phaseATimer = setTimeout(() => {
      // Small delay before starting Phase B
      setTimeout(() => {
        setAnimationState(prev => ({
          ...prev,
          phase: 'B',
          phaseStartTime: Date.now()
        }))
      }, 200) // 200ms delay between phases
    }, phaseADuration)

    // Phase B: Show halo B for the remaining duration, then complete
    const phaseBTimer = setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        phase: 'complete'
      }))
    }, duration)

    return () => {
      clearTimeout(phaseATimer)
      clearTimeout(phaseBTimer)
    }
  }, [isActive, duration])

  // Animation loop
  useEffect(() => {
    if (!isActive) return

    const animate = () => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - animationState.phaseStartTime
      const centerY = screenHeight / 2 - 100

      if (animationState.phase === 'A') {
        // Halo A: Move from left to right
        const progress = Math.min(elapsedTime / (duration / 2), 1)
        const startX = -haloSize
        const endX = screenWidth + haloSize
        const currentX = startX + (endX - startX) * progress
        
        setHaloPositions(prev => ({
          ...prev,
          haloA: { x: currentX, y: centerY },
          haloB: { x: -haloSize, y: centerY } // Keep halo B off-screen
        }))
      } else if (animationState.phase === 'B') {
        // Halo B: Move from left to right with different end point
        const progress = Math.min(elapsedTime / (duration / 2), 1)
        const startX = -haloSize
        const baseEndX = screenWidth + haloSize
        const distanceOffset = distanceDifference * 2
        const endX = correctAnswer === 'A' 
          ? baseEndX - distanceOffset
          : baseEndX + distanceOffset
        const currentX = startX + (endX - startX) * progress
        
        setHaloPositions(prev => ({
          ...prev,
          haloA: { x: screenWidth + haloSize, y: centerY }, // Keep halo A off-screen
          haloB: { x: currentX, y: centerY }
        }))
      }

      if (animationState.phase !== 'complete') {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, animationState.phase, animationState.phaseStartTime, duration, haloSize, distanceDifference, correctAnswer])

  const haloA: Omit<HaloProps, 'color'> = {
    x: haloPositions.haloA.x,
    y: haloPositions.haloA.y,
    size: haloSize,
    label: 'A',
    phase: (animationState.phase === 'A' ? 'A' : 'complete') as 'A' | 'B' | 'complete'
  }

  const haloB: Omit<HaloProps, 'color'> = {
    x: haloPositions.haloB.x,
    y: haloPositions.haloB.y,
    size: haloSize,
    label: 'B',
    phase: (animationState.phase === 'B' ? 'B' : 'complete') as 'A' | 'B' | 'complete'
  }

  return {
    phase: animationState.phase,
    haloA,
    haloB
  }
}
