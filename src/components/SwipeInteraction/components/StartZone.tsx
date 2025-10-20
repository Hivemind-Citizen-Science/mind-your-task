import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { colors, typography, spacing } from '../../../theme'
import { ZoneProps } from '../types'

interface StartZoneProps extends ZoneProps {
  isActive: boolean
}

export const StartZone: React.FC<StartZoneProps> = ({ 
  x, 
  y, 
  size, 
  isActive, 
  onPress 
}) => {
  console.log('StartZone render:', { x, y, size, isActive })
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isActive ? 1.1 : 1 }],
  }))

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
        },
        animatedStyle,
      ]}
    >
      <View style={[styles.circle, { backgroundColor: '#4A90E2' }]}>
        {/* No label according to spec */}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '600',
  },
})
