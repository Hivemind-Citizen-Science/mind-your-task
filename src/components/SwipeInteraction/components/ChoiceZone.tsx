import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { colors, typography, spacing } from '../../../theme'
import { ZoneProps } from '../types'

interface ChoiceZoneProps extends ZoneProps {
  isActive: boolean
  isHovered?: boolean
}

export const ChoiceZone: React.FC<ChoiceZoneProps> = ({ 
  x, 
  y, 
  size, 
  label, 
  isActive, 
  isHovered,
  onPress 
}) => {
  console.log('ChoiceZone render:', { x, y, size, label, isActive })
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isActive ? 1.05 : 1 }],
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
      <View 
        style={[
          styles.circle, 
          { 
            backgroundColor: '#E3F2FD', // Light blue background as per spec
            borderColor: 'rgba(74, 144, 226, 0.3)', // 2px solid with slight transparency
            borderWidth: 2,
          }
        ]}
      >
        <Text style={[styles.label, { color: '#4A90E2' }]}>
          {label}
        </Text>
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    textAlign: 'center',
  },
})
