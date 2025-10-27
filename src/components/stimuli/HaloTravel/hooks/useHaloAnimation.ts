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
    haloPosition: { x: 0, y: screenHeight / 2 }
  })
  
  const [haloPositions, setHaloPositions] = useState({
    haloA: { x: -screenWidth / 2 + haloSize, y: screenHeight / 2 },
    haloB: { x: -screenWidth / 2 + haloSize, y: screenHeight / 2 }
  })
  
  const animationRef = useRef<number>()
  const overallStartTimeRef = useRef<number>(0)
  const endPositionsRef = useRef<{ haloA: number; haloB: number } | null>(null)

  // Setup phase timing
  useEffect(() => {
    if (!isActive) return

    const startTime = Date.now()
    overallStartTimeRef.current = startTime
    
    // Calculate disappearance points once for this trial
    // Both halos start from the same point and travel at the same speed
    // They disappear at different distances based on the correct answer
    // Disappear between x:0 and x:0.4*width-haloSize
    const minDisappearX = 0
    const maxDisappearX = screenWidth * 0.4 - haloSize
    const baseDisappearX = minDisappearX + (maxDisappearX - minDisappearX) * Math.random()
    
    // Apply distance difference to create different travel distances
    const distanceOffset = distanceDifference
    const haloADisappearX = correctAnswer === 'A' 
      ? baseDisappearX + distanceOffset  // Halo A travels farther
      : baseDisappearX - distanceOffset  // Halo A travels shorter
    const haloBDisappearX = correctAnswer === 'A' 
      ? baseDisappearX - distanceOffset  // Halo B travels shorter
      : baseDisappearX + distanceOffset  // Halo B travels farther
    
    // Ensure disappear points are within bounds
    const clampedHaloADisappearX = Math.max(minDisappearX, Math.min(maxDisappearX, haloADisappearX))
    const clampedHaloBDisappearX = Math.max(minDisappearX, Math.min(maxDisappearX, haloBDisappearX))
    
    endPositionsRef.current = {
      haloA: clampedHaloADisappearX,
      haloB: clampedHaloBDisappearX
    }
    
    // Initialize phaseStartTime for phase A
    setAnimationState(prev => ({
      ...prev,
      phase: 'A',
      phaseStartTime: startTime
    }))
    
    // Debug logging removed for production
  }, [isActive, travelSpeed, haloSize, distanceDifference, correctAnswer, screenWidth])

  // Animation loop
  useEffect(() => {
    if (!isActive) return

    const animate = () => {
      const currentTime = Date.now()
      const phaseElapsedTime = currentTime - animationState.phaseStartTime
      const centerY = screenHeight / 2
      const startX = -screenWidth / 2 + haloSize
      
      // Debug logging removed for production

      if (animationState.phase === 'A') {
        // Halo A: Calculate duration based on travel distance and speed
        const disappearX = endPositionsRef.current?.haloA || screenWidth + haloSize
        const travelDistance = disappearX - startX
        const phaseDuration = (travelDistance / travelSpeed) * 1000 // Convert to milliseconds
        
        const progress = Math.min(phaseElapsedTime / phaseDuration, 1)
        const currentX = startX + (disappearX - startX) * progress
        
        // Check if Phase A is complete and transition to Phase B
        if (progress >= 1) {
          setAnimationState(prev => ({
            ...prev,
            phase: 'B',
            phaseStartTime: currentTime
          }))
          return
        }
        
        setHaloPositions(prev => ({
          ...prev,
          haloA: { x: currentX, y: centerY },
          haloB: { x: startX, y: centerY } // Keep halo B at starting position
        }))
      } else if (animationState.phase === 'B') {
        // Halo B: Calculate duration based on travel distance and speed
        const disappearX = endPositionsRef.current?.haloB || screenWidth + haloSize
        const travelDistance = disappearX - startX
        const phaseDuration = (travelDistance / travelSpeed) * 1000 // Convert to milliseconds
        
        const progress = Math.min(phaseElapsedTime / phaseDuration, 1)
        const currentX = startX + (disappearX - startX) * progress
        
        // Check if Phase B is complete and transition to complete
        if (progress >= 1) {
          setAnimationState(prev => ({
            ...prev,
            phase: 'complete'
          }))
          return
        }
        
        setHaloPositions(prev => ({
          ...prev,
          haloA: { x: screenWidth + haloSize, y: centerY }, // Halo A is off-screen
          haloB: { x: currentX, y: centerY }
        }))
      } else if (animationState.phase === 'complete') {
        // Both halos are off-screen
        setHaloPositions(prev => ({
          ...prev,
          haloA: { x: screenWidth + haloSize, y: centerY },
          haloB: { x: screenWidth + haloSize, y: centerY }
        }))
        return // Stop animation
      }

      // Continue animation if not complete
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, animationState.phase, animationState.phaseStartTime, travelSpeed, haloSize, distanceDifference, correctAnswer, screenWidth])

  const haloA: Omit<HaloProps, 'color'> = {
    x: haloPositions.haloA.x,
    y: haloPositions.haloA.y,
    size: haloSize,
    label: 'A',
    phase: animationState.phase === 'A' ? 'A' : (animationState.phase === 'B' ? 'complete' : 'complete')
  }

  const haloB: Omit<HaloProps, 'color'> = {
    x: haloPositions.haloB.x,
    y: haloPositions.haloB.y,
    size: haloSize,
    label: 'B',
    phase: animationState.phase === 'B' ? 'B' : (animationState.phase === 'A' ? 'complete' : 'complete')
  }

  return {
    phase: animationState.phase,
    haloA,
    haloB
  }
}
