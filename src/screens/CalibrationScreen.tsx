import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { TrialFlow } from '../components/TrialFlow/TrialFlow'
import { TrialConfig, TrialResult, Session } from '../types'
import { generateCalibrationTrialsWithNumbers } from '../utils/trialGenerators/calibrationGenerator'
import { generateSessionId } from '../utils/uuid'
import { saveSession, saveTrial } from '../utils/storage'
import { colors, typography, spacing } from '../theme'

export const CalibrationScreen: React.FC = () => {
  const navigation = useNavigation()
  const [trials, setTrials] = useState<TrialConfig[]>([])
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [results, setResults] = useState<TrialResult[]>([])

  useEffect(() => {
    // Generate trials on component mount
    const generatedTrials = generateCalibrationTrialsWithNumbers()
    setTrials(generatedTrials)
    
    // Create session
    const newSessionId = generateSessionId()
    setSessionId(newSessionId)
    
    // Save session start
    const session: Session = {
      session_id: newSessionId,
      study_id: 'default', // Will be updated with actual study ID
      device_id: 'default', // Will be updated with actual device ID
      task_type: 'calibration',
      period_type: 'practice',
      session_date: new Date().toISOString().split('T')[0],
      started_at: Date.now(),
      completed_at: null,
      completed: false,
      is_practice: true,
      is_post_study: false,
      trial_ids: generatedTrials.map(t => t.trial_id),
    }
    
    saveSession(session)
  }, [])

  const handleTrialComplete = (result: TrialResult) => {
    // Save trial result
    saveTrial({
      ...result,
      session_id: sessionId!,
      task_type: 'calibration',
      trial_number: currentTrialIndex + 1,
      trial_parameters: trials[currentTrialIndex].trial_parameters,
      correct_answer: trials[currentTrialIndex].correct_answer,
      feedback_shown: result.is_correct ? 'green' : 'red',
      synced: false,
    })

    // Add to results
    setResults(prev => [...prev, result])

    // Move to next trial or complete
    if (currentTrialIndex < trials.length - 1) {
      setCurrentTrialIndex(prev => prev + 1)
    } else {
      // All trials complete
      setIsComplete(true)
      
      // Update session as completed
      if (sessionId) {
        const session = {
          session_id: sessionId,
          study_id: 'default',
          device_id: 'default',
          task_type: 'calibration',
          period_type: 'practice',
          session_date: new Date().toISOString().split('T')[0],
          started_at: Date.now() - (trials.length * 10000), // Approximate start time
          completed_at: Date.now(),
          completed: true,
          is_practice: true,
          is_post_study: false,
          trial_ids: trials.map(t => t.trial_id),
        }
        saveSession(session)
      }
    }
  }

  const handleContinue = () => {
    // Navigate to Home screen
    navigation.navigate('Home' as never)
  }

  if (isComplete) {
    const correctCount = results.filter(r => r.is_correct).length
    const totalCount = results.length
    const accuracy = Math.round((correctCount / totalCount) * 100)

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completeContainer}>
          <Text style={styles.title}>Calibration Complete!</Text>
          <Text style={styles.subtitle}>Great job completing the calibration task</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{correctCount}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalCount}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{accuracy}%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Text style={styles.button} onPress={handleContinue}>
              Continue
            </Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  if (trials.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Preparing calibration...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const currentTrial = trials[currentTrialIndex]

  return (
    <SafeAreaView style={styles.container}>
      <TrialFlow
        trialData={currentTrial}
        onTrialComplete={handleTrialComplete}
        showCounter={true}
        currentTrial={currentTrialIndex + 1}
        totalTrials={trials.length}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.heading1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.heading1,
    color: colors.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: colors.buttonPrimary,
    color: colors.surface,
    ...typography.button,
    textAlign: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    overflow: 'hidden',
  },
})
