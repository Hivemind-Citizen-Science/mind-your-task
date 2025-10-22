import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { SwipeInteraction } from '../../SwipeInteraction/SwipeInteraction'
import { SwipeResult } from '../../SwipeInteraction/types'
import { TrialResult } from '../../../types'
import { colors, typography, spacing } from '../../../theme'

interface DotKinematogramProps {
  coherence: number
  direction: 'left' | 'right'
  apertureShape: 'square' | 'circle'
  apertureSize: number
  dotCount: number
  duration: number
  onComplete: (result: TrialResult) => void
}

export const DotKinematogram: React.FC<DotKinematogramProps> = ({
  coherence,
  direction,
  apertureShape,
  apertureSize,
  dotCount,
  duration,
  onComplete
}) => {
  const [isActive, setIsActive] = useState(false)
  const [showStimulus, setShowStimulus] = useState(false)

  useEffect(() => {
    // Show stimulus after a brief delay
    const timer = setTimeout(() => {
      setShowStimulus(true)
      setIsActive(true)
    }, 500)

    // Hide stimulus after duration
    const hideTimer = setTimeout(() => {
      setShowStimulus(false)
      setIsActive(false)
    }, 500 + duration)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [duration])

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
      {showStimulus && (
        <View style={styles.stimulusContainer}>
          <View style={[
            styles.aperture,
            {
              width: apertureSize,
              height: apertureSize,
              borderRadius: apertureShape === 'circle' ? apertureSize / 2 : 0,
            }
          ]}>
            <Text style={styles.stimulusText}>
              {coherence}% coherence
            </Text>
            <Text style={styles.directionText}>
              Direction: {direction}
            </Text>
          </View>
        </View>
      )}
      
      <SwipeInteraction
        onSwipeComplete={handleSwipeComplete}
        leftLabel="Left"
        rightLabel="Right"
        disabled={!isActive}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  stimulusContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  aperture: {
    backgroundColor: colors.stimulusBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  stimulusText: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  directionText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
})
