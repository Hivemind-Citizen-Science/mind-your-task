import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { SwipeInteraction } from '../../SwipeInteraction/SwipeInteraction'
import { SwipeResult } from '../../SwipeInteraction/types'
import { TrialResult } from '../../../types'
import { colors, typography, spacing } from '../../../theme'

interface HaloTravelProps {
  correctAnswer: 'A' | 'B'
  haloSize: number
  travelSpeed: number
  distanceDifference: number
  haloColor: string
  onComplete: (result: TrialResult) => void
}

export const HaloTravel: React.FC<HaloTravelProps> = ({
  correctAnswer,
  haloSize,
  travelSpeed,
  distanceDifference,
  haloColor,
  onComplete
}) => {
  const [isActive, setIsActive] = useState(false)
  const [showStimulus, setShowStimulus] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<'A' | 'B' | 'complete'>('A')

  useEffect(() => {
    // Show stimulus after a brief delay
    const timer = setTimeout(() => {
      setShowStimulus(true)
      setIsActive(true)
    }, 500)

    // Phase A animation
    const phaseATimer = setTimeout(() => {
      setCurrentPhase('B')
    }, 1000)

    // Phase B animation
    const phaseBTimer = setTimeout(() => {
      setCurrentPhase('complete')
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearTimeout(phaseATimer)
      clearTimeout(phaseBTimer)
    }
  }, [])

  const handleSwipeComplete = (result: SwipeResult) => {
    // Map left/right to A/B for comparison
    const mappedChoice = result.choice === 'left' ? 'A' : 'B'
    const isCorrect = mappedChoice === correctAnswer
    onComplete({
      trial_id: `trial-${Date.now()}`,
      user_response: mappedChoice,
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
          <Text style={styles.instruction}>
            Watch the halos travel, then choose which traveled farther
          </Text>
          
          <View style={styles.haloContainer}>
            {currentPhase === 'A' && (
              <View style={[
                styles.halo,
                {
                  width: haloSize,
                  height: haloSize,
                  backgroundColor: haloColor,
                }
              ]}>
                <Text style={styles.haloLabel}>A</Text>
              </View>
            )}
            
            {currentPhase === 'B' && (
              <View style={[
                styles.halo,
                {
                  width: haloSize,
                  height: haloSize,
                  backgroundColor: haloColor,
                  marginTop: spacing.lg,
                }
              ]}>
                <Text style={styles.haloLabel}>B</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.phaseText}>
            Phase: {currentPhase}
          </Text>
          <Text style={styles.answerText}>
            Correct answer: {correctAnswer}
          </Text>
        </View>
      )}
      
      <SwipeInteraction
        onSwipeComplete={handleSwipeComplete}
        leftLabel="A"
        rightLabel="B"
        disabled={!isActive || currentPhase !== 'complete'}
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
  instruction: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  haloContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  halo: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  haloLabel: {
    ...typography.heading2,
    color: colors.white,
    fontWeight: 'bold',
  },
  phaseText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  answerText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
})
