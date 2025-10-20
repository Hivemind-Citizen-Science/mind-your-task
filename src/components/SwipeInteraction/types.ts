import { TrajectoryPoint } from '../../types'

export interface SwipeInteractionProps {
  onSwipeComplete: (result: SwipeResult) => void
  leftLabel: string
  rightLabel: string
  disabled?: boolean
}

export interface SwipeResult {
  choice: 'left' | 'right'
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
