import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, Alert, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { colors } from '../theme'
import { TrialFlow } from '../components/TrialFlow/TrialFlow'
import { CalibrationStimulus } from '../components/stimuli/CalibrationStimulus'
import { DotKinematogram } from '../components/stimuli/DotKinematogram/DotKinematogram'
import { HaloTravel } from '../components/stimuli/HaloTravel/HaloTravel'
import { TrialConfig, TrialResult, Session, Trial } from '../types'
import { getStudyConfig } from '../utils/storage'
import { createSession, saveSessionData, completeSession } from '../utils/sessionManager'
import { saveTrialAndQueue } from '../utils/trialSyncManager'
import { generateTrialsForTask } from '../utils/trialGenerators'

type TaskScreenRouteProp = RouteProp<{
  params: {
    taskType: 'calibration' | 'dot_kinematogram' | 'halo_travel'
  }
}, 'params'>

type TaskScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>

export const TaskScreen: React.FC = () => {
  const navigation = useNavigation<TaskScreenNavigationProp>()
  const route = useRoute<TaskScreenRouteProp>()
  const { taskType } = route.params
  
  const [trials, setTrials] = useState<TrialConfig[]>([])
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0)
  const [session, setSession] = useState<Session | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize task
  useEffect(() => {
    const initializeTask = () => {
      try {
        const config = getStudyConfig()
        if (!config) {
          Alert.alert('Error', 'Study configuration not found')
          navigation.goBack()
          return
        }

        const taskConfig = config.task_configs[taskType]
        if (!taskConfig || !taskConfig.enabled) {
          Alert.alert('Error', `Task ${taskType} is not enabled`)
          navigation.goBack()
          return
        }

        // Generate trials
        const generatedTrials = generateTrialsForTask(taskType, taskConfig)
        setTrials(generatedTrials)

        // Create and save session
        const newSession = createSession(taskType)
        setSession(newSession)
        saveSessionData(newSession)

        setIsInitialized(true)
        console.log(`Initialized ${taskType} task with ${generatedTrials.length} trials`)
      } catch (error) {
        console.error('Failed to initialize task:', error)
        Alert.alert('Error', 'Failed to initialize task')
        navigation.goBack()
      }
    }

    initializeTask()
  }, [taskType, navigation])

  // Handle trial completion
  const handleTrialComplete = useCallback((result: TrialResult) => {
    if (!session) {
      console.error('No active session for trial completion')
      return
    }

    try {
      // Create trial object
      const trial: Trial = {
        trial_id: result.trial_id,
        session_id: session.session_id,
        task_type: taskType,
        trial_number: currentTrialIndex + 1,
        trial_parameters: {},
        user_response: result.user_response,
        correct_answer: result.user_response, // For now, assume user response is correct
        is_correct: result.is_correct,
        response_time_ms: result.response_time_ms,
        trajectory_data: result.trajectory_data,
        feedback_shown: result.is_correct ? 'green' : 'red',
        no_response: result.no_response,
        timestamp: result.timestamp,
        synced: false
      }

      // Save trial locally and queue for backend sync
      saveTrialAndQueue(trial)

      // Update session with trial ID
      const updatedSession = {
        ...session,
        trial_ids: [...session.trial_ids, trial.trial_id]
      }
      setSession(updatedSession)
      saveSessionData(updatedSession)

      // Move to next trial or complete session
      if (currentTrialIndex < trials.length - 1) {
        setCurrentTrialIndex(currentTrialIndex + 1)
      } else {
        // Complete session
        const allTrials = trials.map((trialConfig, index) => ({
          trial_id: trialConfig.trial_id,
          session_id: session.session_id,
          task_type: taskType,
          trial_number: index + 1,
          trial_parameters: trialConfig.trial_parameters,
          user_response: '', // Will be filled by actual trial results
          correct_answer: trialConfig.correct_answer,
          is_correct: false, // Will be filled by actual trial results
          response_time_ms: 0, // Will be filled by actual trial results
          trajectory_data: [], // Will be filled by actual trial results
          feedback_shown: 'green' as const,
          no_response: false,
          timestamp: Date.now(),
          synced: false
        }))

        completeSession(session.session_id, allTrials)
        
        // Navigate to completion screen
        navigation.navigate('SessionCompletion', { sessionId: session.session_id })
      }
    } catch (error) {
      console.error('Failed to handle trial completion:', error)
      Alert.alert('Error', 'Failed to save trial data')
    }
  }, [session, currentTrialIndex, trials, taskType, navigation])

  // Render stimulus based on task type
  const renderStimulus = useCallback((trial: TrialConfig) => {
    const commonProps = {
      onComplete: () => handleTrialComplete({
        trial_id: trial.trial_id,
        user_response: '', // Will be set by the stimulus component
        is_correct: false, // Will be set by the stimulus component
        response_time_ms: 0, // Will be set by the stimulus component
        trajectory_data: [], // Will be set by the stimulus component
        timestamp: Date.now(),
        no_response: false
      })
    }

    switch (taskType) {
      case 'calibration':
        return (
          <CalibrationStimulus
            direction={trial.trial_parameters.direction}
            onComplete={commonProps.onComplete}
          />
        )
      
      case 'dot_kinematogram':
        const { width: screenWidth } = Dimensions.get('window')
        const dynamicApertureSize = screenWidth * 0.5 // Half screen width
        console.log('TaskScreen: Overriding aperture size to:', dynamicApertureSize)
        return (
          <DotKinematogram
            coherence={trial.trial_parameters.coherence}
            direction={trial.trial_parameters.direction}
            apertureShape={trial.trial_parameters.aperture_shape}
            apertureSize={dynamicApertureSize}
            dotCount={trial.trial_parameters.dot_count}
            duration={trial.trial_parameters.stimulus_duration}
          />
        )
      
      case 'halo_travel':
        return (
          <HaloTravel
            correctAnswer={trial.trial_parameters.correct_answer}
            haloSize={trial.trial_parameters.halo_size}
            travelSpeed={trial.trial_parameters.travel_speed}
            distanceDifference={trial.trial_parameters.distance_difference}
            haloColor={trial.trial_parameters.halo_color}
            onComplete={commonProps.onComplete}
          />
        )
      
      default:
        console.error(`Unknown task type: ${taskType}`)
        return null
    }
  }, [taskType, handleTrialComplete])

  // Handle back button
  const handleBackPress = useCallback(() => {
    if (session) {
      Alert.alert(
        'Abandon Session',
        'Are you sure you want to abandon this session? Your progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Abandon',
            style: 'destructive',
            onPress: () => {
              // TODO: Implement abandon session
              navigation.goBack()
            }
          }
        ]
      )
    } else {
      navigation.goBack()
    }
  }, [session, navigation])

  if (!isInitialized || trials.length === 0 || !session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          {/* Loading indicator would go here */}
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
        renderStimulus={renderStimulus}
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
})
