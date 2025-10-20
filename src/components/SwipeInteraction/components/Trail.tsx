import React from 'react'
import { StyleSheet } from 'react-native'
import { Svg, Path } from 'react-native-svg'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { colors } from '../../../theme'
import { TrajectoryPoint } from '../../../types'

interface TrailProps {
  trajectory: TrajectoryPoint[]
  isVisible: boolean
  strokeWidth?: number
}

// Create smooth path function for continuous swipe trail
const createSmoothPath = (points: TrajectoryPoint[]): string => {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
  
  // Start with move command to first point
  let path = `M ${points[0].x} ${points[0].y}`
  
  // Add line segments to each subsequent point
  for (let i = 1; i < points.length; i++) {
    const point = points[i]
    path += ` L ${point.x} ${point.y}`
  }
  
  return path
}

export const Trail: React.FC<TrailProps> = ({ trajectory, isVisible, strokeWidth = 40 }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isVisible ? 1 : 0,
  }))

  console.log('Trail render:', { 
    trajectoryLength: trajectory.length, 
    isVisible, 
    firstPoint: trajectory[0], 
    lastPoint: trajectory[trajectory.length - 1],
    pathData: trajectory.length > 0 ? `M ${trajectory[0].x} ${trajectory[0].y}` : 'empty'
  })

  if (trajectory.length < 2) {
    return null
  }

  // Create smooth SVG path from trajectory points
  const pathData = createSmoothPath(trajectory)


  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path
          d={pathData}
          stroke="#7AB8F5"
          strokeWidth={strokeWidth}
          strokeOpacity={0.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1, // Ensure trail is above background but below coin
  },
})
