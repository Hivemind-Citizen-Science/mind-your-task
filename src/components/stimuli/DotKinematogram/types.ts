export interface Dot {
  x: number
  y: number
  vx: number
  vy: number
  id: string
}

export interface DotKinematogramProps {
  coherence: number           // 0-100
  direction: 'left' | 'right'
  dotCount: number
  apertureSize: number
  apertureShape: 'square' | 'circle'
  duration: number
}

export interface ApertureProps {
  size: number
  shape: 'square' | 'circle'
  children: React.ReactNode
}

export interface DotProps {
  x: number
  y: number
  size?: number
}
