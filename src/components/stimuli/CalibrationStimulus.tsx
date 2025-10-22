import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { SwipeInteraction } from '../SwipeInteraction/SwipeInteraction'
import { SwipeResult } from '../SwipeInteraction/types'
import { TrialResult } from '../../types'
import { colors, typography, spacing } from '../../theme'

interface CalibrationStimulusProps {
  direction: 'left' | 'right'
  onComplete: (result: TrialResult) => void
}

export const CalibrationStimulus: React.FC<CalibrationStimulusProps> = ({
  direction,
  onComplete
}) => {
  const [isActive, setIsActive] = useState(false)

  const handleSwipeComplete = (result: SwipeResult) => {
    const isCorrect = result.choice === direction
    onComplete({
      trial_id: `trial-${Date.now()}`,
      user_response: result.choice,
      is_correct: isCorrect,
      response_time_ms: result.responseTimeMs,
      trajectory_data: result.trajectoryData,
      timestamp: Date.now(),
      no_response: false
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          Swipe {direction} when ready
        </Text>
      </View>
      
      <SwipeInteraction
        onSwipeComplete={handleSwipeComplete}
        leftLabel="Left"
        rightLabel="Right"
        disabled={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  instructionContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  instruction: {
    ...typography.heading2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
})
