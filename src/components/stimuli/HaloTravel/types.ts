export interface HaloTravelProps {
  correctAnswer: 'A' | 'B'
  haloSize: number
  travelSpeed: number
  distanceDifference: number
  haloColor: string
  duration: number
}

export interface HaloProps {
  x: number
  y: number
  size: number
  color: string
  label: 'A' | 'B'
  phase: 'A' | 'B' | 'complete'
}

export interface HaloAnimationState {
  phase: 'A' | 'B' | 'complete'
  phaseStartTime: number
  haloPosition: { x: number; y: number }
}
