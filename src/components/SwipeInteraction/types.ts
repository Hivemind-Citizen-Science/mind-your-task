import { TrajectoryPoint } from '../../types'

export interface SwipeInteractionProps {
  onSwipeComplete: (result: SwipeResult) => void
  choiceLabels: [string, string]  // [leftChoice, rightChoice]
  disabled?: boolean
}

export interface SwipeResult {
  choice: 'left' | 'right' | 'A' | 'B'
  trajectoryData: TrajectoryPoint[]
  responseTimeMs: number
}

export interface SwipeState {
  isActive: boolean
  coinPosition: { x: number; y: number }
  startPosition: { x: number; y: number }
  trajectory: TrajectoryPoint[]
  startTime: number
}

export interface ZoneProps {
  x: number
  y: number
  size: number
  label?: string
  isActive?: boolean
  onPress?: () => void
}
