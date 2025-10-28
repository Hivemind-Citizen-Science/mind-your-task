import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, typography } from '../../theme'

interface CalibrationStimulusProps {
  direction: 'left' | 'right'
  duration?: number
  onStimulusComplete?: () => void
}

export const CalibrationStimulus: React.FC<CalibrationStimulusProps> = ({
  direction,
  duration = 800,
  onStimulusComplete
}) => {
  // Handle stimulus duration like DotKinematogram
  useEffect(() => {
    if (onStimulusComplete) {
      const timer = setTimeout(() => {
        onStimulusComplete()
      }, duration)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [onStimulusComplete, duration])

  return (
    <View style={styles.container}>
      {/* <View style={styles.stimulusContainer}> */}
        <Text style={styles.stimulus}>
          {direction.toUpperCase()}
        </Text>
      {/* </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 20,
    paddingVertical: 40,
  },
  stimulusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  stimulus: {
    // ...typography.heading1,
    color: colors.textPrimary,
    // textAlign: 'center',
    fontSize: 48,
    fontWeight: 'bold',
    // includeFontPadding: false,
    // textAlignVertical: 'center',
  },
})
