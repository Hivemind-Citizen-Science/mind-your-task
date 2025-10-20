import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated'
import { colors } from '../../../theme'

interface CoinProps {
  position: SharedValue<{ x: number; y: number }>
  isActive: boolean
  size: number
}

export const Coin: React.FC<CoinProps> = ({ position, isActive, size }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value.x - size / 2 },
      { translateY: position.value.y - size / 2 },
      { scale: isActive ? 1.1 : 1 }
    ],
  }))

  return (
    <Animated.View
      style={[
        styles.coin,
        {
          width: size,
          height: size,
        },
        animatedStyle,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  coin: {
    position: 'absolute',
    backgroundColor: '#4A90E2', // Primary blue as per spec
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})
