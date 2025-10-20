import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSequence,
  runOnJS 
} from 'react-native-reanimated'
import { colors } from '../../../theme'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface FeedbackOverlayProps {
  isCorrect: boolean
  position: { x: number; y: number }
  onAnimationComplete: () => void
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ 
  isCorrect, 
  position, 
  onAnimationComplete 
}) => {
  const scale = useSharedValue(0)
  const opacity = useSharedValue(0)

  React.useEffect(() => {
    // Animate in
    scale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withTiming(1, { duration: 100 })
    )
    opacity.value = withTiming(1, { duration: 150 })

    // Animate out after delay
    const timer = setTimeout(() => {
      scale.value = withTiming(0, { duration: 200 })
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(onAnimationComplete)()
      })
    }, 200)

    return () => clearTimeout(timer)
  }, [isCorrect, position, onAnimationComplete])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          left: position.x - 30,
          top: position.y - 30,
        },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.circle,
          {
            backgroundColor: isCorrect ? colors.feedbackCorrect : colors.feedbackIncorrect,
          },
        ]}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
})
