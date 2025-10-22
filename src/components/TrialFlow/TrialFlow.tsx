import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { useTrialStateMachine } from './hooks/useTrialStateMachine'
import { StartButton } from './components/StartButton'
import { FixationCross } from './components/FixationCross'
import { FeedbackOverlay } from './components/FeedbackOverlay'
import { SwipeInteraction } from '../SwipeInteraction/SwipeInteraction'
import { TrialConfig, TrialResult } from '../../types'
import { colors, typography, spacing } from '../../theme'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface TrialFlowProps {
  trialData: TrialConfig
  onTrialComplete: (result: TrialResult) => void
  showCounter?: boolean
  currentTrial?: number
  totalTrials?: number
  stimulusComponent?: React.ComponentType<{ direction: string }>
  renderStimulus?: (trial: TrialConfig) => React.ReactElement | null
}

export const TrialFlow: React.FC<TrialFlowProps> = ({
  trialData,
  onTrialComplete,
  showCounter = true,
  currentTrial,
  totalTrials,
  stimulusComponent: StimulusComponent,
  renderStimulus,
}) => {
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackPosition, setFeedbackPosition] = useState({ x: 0, y: 0 })

  const {
    currentState,
    trialResult,
    isActive,
    startTrial,
    handleSwipeComplete,
    resetTrial,
  } = useTrialStateMachine({
    trialData,
    onTrialComplete,
  })

  // Reset trial when trialData changes (new trial)
  useEffect(() => {
    resetTrial()
  }, [trialData.trial_id, resetTrial])

  const handleSwipeResult = (result: any) => {
    // Calculate feedback position based on choice
    const leftChoiceX = 120 / 2 + 20
    const rightChoiceX = screenWidth - 120 / 2 - 20
    const choiceY = 120 / 2 + 20

    const position = result.choice === 'left' 
      ? { x: leftChoiceX, y: choiceY }
      : { x: rightChoiceX, y: choiceY }

    setFeedbackPosition(position)
    setShowFeedback(true)
    
    handleSwipeComplete(result.choice, result.trajectoryData, result.responseTimeMs)
  }

  const handleFeedbackComplete = () => {
    setShowFeedback(false)
  }

  const renderStateContent = () => {
    switch (currentState) {
      case 'IDLE':
        return (
          <View style={styles.centerContent}>
            <StartButton onPress={startTrial} />
          </View>
        )

      case 'DELAY':
        return (
          <View style={styles.centerContent}>
            <Text style={styles.stateText}>Get ready...</Text>
          </View>
        )

      case 'FIXATION':
        return (
          <View style={styles.centerContent}>
            <FixationCross />
          </View>
        )

      case 'STIMULUS':
        return (
          <View style={styles.stimulusArea}>
            {renderStimulus ? (
              renderStimulus(trialData)
            ) : StimulusComponent ? (
              <StimulusComponent direction={trialData.trial_parameters.direction} />
            ) : (
              <Text style={styles.stimulusText}>
                {trialData.trial_parameters.direction?.toUpperCase() || 'STIMULUS'}
              </Text>
            )}
          </View>
        )

      case 'RESPONSE':
        return (
          <SwipeInteraction
            onSwipeComplete={handleSwipeResult}
            leftLabel="LEFT"
            rightLabel="RIGHT"
          />
        )

      case 'FEEDBACK':
        return (
          <View style={styles.centerContent}>
            <Text style={styles.stateText}>
              {trialResult?.is_correct ? 'Correct!' : 'Incorrect'}
            </Text>
          </View>
        )

      case 'REST':
        return (
          <View style={styles.centerContent}>
            <FixationCross />
          </View>
        )

      case 'COMPLETE':
        return (
          <View style={styles.centerContent}>
            <Text style={styles.stateText}>Trial Complete</Text>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <View style={styles.container}>
      {/* Trial Counter */}
      {showCounter && currentTrial && totalTrials && (
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            Trial {currentTrial} of {totalTrials}
          </Text>
        </View>
      )}

      {/* State Content */}
      <View style={styles.contentContainer}>
        {renderStateContent()}
      </View>

      {/* Feedback Overlay */}
      {showFeedback && trialResult && (
        <FeedbackOverlay
          isCorrect={trialResult.is_correct ?? false}
          position={feedbackPosition}
          onAnimationComplete={handleFeedbackComplete}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  counterContainer: {
    position: 'absolute',
    top: screenHeight * 0.05, // 5% from top edge (responsive)
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  counterText: {
    ...typography.body,
    color: colors.textSecondary,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stimulusArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.stimulusBackground,
  },
  stimulusText: {
    ...typography.heading1,
    color: colors.stimulusElement,
    fontWeight: '700',
  },
  stateText: {
    ...typography.heading2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
})
