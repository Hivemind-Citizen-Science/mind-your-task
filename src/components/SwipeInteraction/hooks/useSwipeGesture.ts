import { useCallback, useRef } from 'react'
import { Gesture } from 'react-native-gesture-handler'
import { runOnJS, useSharedValue } from 'react-native-reanimated'
import { Platform } from 'react-native'
import { SwipeState, SwipeResult } from '../types'

interface UseSwipeGestureProps {
  onSwipeComplete: (result: SwipeResult) => void
  startZoneY: number
  choiceZoneSize: number
  screenWidth: number
  screenHeight: number
  onTrailStart?: () => void
}

export const useSwipeGesture = ({
  onSwipeComplete,
  startZoneY,
  choiceZoneSize,
  screenWidth,
  screenHeight,
  onTrailStart,
}: UseSwipeGestureProps) => {
  const coinPosition = useSharedValue({ x: screenWidth / 2, y: startZoneY })
  const isActive = useSharedValue(false)
  const startPosition = useSharedValue({ x: 0, y: 0 })
  const trajectory = useSharedValue<Array<{ x: number; y: number; timestamp: number }>>([])
  const startTime = useSharedValue(0)

  const resetState = useCallback(() => {
    coinPosition.value = { x: screenWidth / 2, y: startZoneY }
    isActive.value = false
    trajectory.value = []
  }, [screenWidth, startZoneY])

  const handleSwipeComplete = useCallback((result: SwipeResult) => {
    onSwipeComplete(result)
    resetState()
  }, [onSwipeComplete, resetState])

  const gestureHandler = Gesture.Pan()
    .onStart((event) => {
      'worklet'
      const startX = screenWidth / 2
      const startY = startZoneY
      
      // Check if gesture started within start zone (with tolerance)
      const tolerance = 60
      const distanceFromStart = Math.sqrt(
        Math.pow(event.x - startX, 2) + Math.pow(event.y - startY, 2)
      )
      
      if (distanceFromStart <= tolerance) {
        isActive.value = true
        startPosition.value = { x: event.x, y: event.y }
        startTime.value = Date.now()
        
        coinPosition.value = { x: event.x, y: event.y }
        
        // Clear trail on gesture start
        if (onTrailStart) {
          runOnJS(onTrailStart)()
        }
      }
    })
    .onUpdate((event) => {
      'worklet'
      if (!isActive.value) return
      
      // Constraint: cannot go below start zone Y coordinate
      // Only apply constraint if trying to go below start zone
      const constrainedY = event.y > startZoneY ? startZoneY : event.y
      
      coinPosition.value = { x: event.x, y: constrainedY }
      
      // Record trajectory point
      const newTrajectory = [...trajectory.value, {
        x: event.x,
        y: constrainedY,
        timestamp: Date.now()
      }]
      trajectory.value = newTrajectory
      console.log('Gesture: Added trajectory point', newTrajectory.length, 'total points')
    })
    .onEnd((event) => {
      'worklet'
      if (!isActive.value) return
      
      const endTime = Date.now()
      const responseTime = endTime - startTime.value
      
      // Check if coin entered a choice zone (using responsive positioning)
      const edgeMargin = screenWidth * 0.05 // 5% from edges
      const leftZoneX = edgeMargin + choiceZoneSize / 2
      const rightZoneX = screenWidth - edgeMargin - choiceZoneSize / 2
      const topZoneY = screenHeight * 0.15 // 15% from top edge
      
      const coinX = coinPosition.value.x
      const coinY = coinPosition.value.y
      
      // Check left zone
      if (coinX <= leftZoneX + choiceZoneSize / 2 && coinY <= topZoneY + choiceZoneSize / 2) {
        const result: SwipeResult = {
          choice: 'left',
          trajectoryData: trajectory.value,
          responseTimeMs: responseTime
        }
        runOnJS(handleSwipeComplete)(result)
        return
      }
      
      // Check right zone
      if (coinX >= rightZoneX - choiceZoneSize / 2 && coinY <= topZoneY + choiceZoneSize / 2) {
        const result: SwipeResult = {
          choice: 'right',
          trajectoryData: trajectory.value,
          responseTimeMs: responseTime
        }
        runOnJS(handleSwipeComplete)(result)
        return
      }
      
      // No valid choice made, reset
      runOnJS(resetState)()
    })

  return {
    coinPosition,
    isActive,
    gestureHandler,
    resetState,
    trajectory: trajectory
  }
}
