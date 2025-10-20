import { useRef, useCallback } from 'react'
import { SharedValue } from 'react-native-reanimated'
import { TrajectoryPoint } from '../../types'

interface UseTrajectoryRecordingProps {
  isActive: boolean
  coinPosition: SharedValue<{ x: number; y: number }>
}

export const useTrajectoryRecording = ({ isActive, coinPosition }: UseTrajectoryRecordingProps) => {
  const trajectory = useRef<TrajectoryPoint[]>([])
  const startTime = useRef<number>(0)

  const startRecording = useCallback(() => {
    trajectory.current = []
    startTime.current = Date.now()
  }, [])

  const recordPoint = useCallback((x: number, y: number) => {
    if (!isActive) return
    
    trajectory.current.push({
      x,
      y,
      timestamp: Date.now()
    })
  }, [isActive])

  const stopRecording = useCallback(() => {
    return trajectory.current
  }, [])

  const getTrajectory = useCallback(() => {
    return trajectory.current
  }, [])

  const clearTrajectory = useCallback(() => {
    trajectory.current = []
  }, [])

  return {
    startRecording,
    recordPoint,
    stopRecording,
    getTrajectory,
    clearTrajectory
  }
}
