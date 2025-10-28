import { useState, useCallback, useRef, useEffect } from 'react'
import { TrialConfig, TrialResult } from '../../../types'

export type TrialState = 
  | 'IDLE'
  | 'DELAY'
  | 'FIXATION'
  | 'STIMULUS'
  | 'RESPONSE'
  | 'FEEDBACK'
  | 'REST'
  | 'COMPLETE'

interface TrialStateMachineProps {
  trialData: TrialConfig
  onTrialComplete: (result: TrialResult) => void
  timeoutSeconds?: number
  delayRangeMs?: [number, number]
  fixationDurationMs?: number
  restPeriodMs?: number
  feedbackDurationMs?: number
  stimulusDurationMs?: number
  disableStimulusTimeout?: boolean
}

export const useTrialStateMachine = ({
  trialData,
  onTrialComplete,
  timeoutSeconds = 5,
  delayRangeMs = [700, 1000],
  fixationDurationMs = 300,
  restPeriodMs = 300,
  feedbackDurationMs = 300,
  stimulusDurationMs,
  disableStimulusTimeout = false,
}: TrialStateMachineProps) => {
  const [currentState, setCurrentState] = useState<TrialState>('IDLE')
  const [trialResult, setTrialResult] = useState<Partial<TrialResult> | null>(null)
  const [isActive, setIsActive] = useState(false)
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const responseStartTimeRef = useRef<number>(0)

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const startTrial = useCallback(() => {
    if (isActive) return
    
    setIsActive(true)
    setCurrentState('DELAY')
    startTimeRef.current = Date.now()
    
    // Random delay
    const delay = Math.random() * (delayRangeMs[1] - delayRangeMs[0]) + delayRangeMs[0]
    
    timeoutRef.current = setTimeout(() => {
      setCurrentState('FIXATION')
      
      timeoutRef.current = setTimeout(() => {
        setCurrentState('STIMULUS')
        
        // Only set stimulus timeout if not disabled
        if (!disableStimulusTimeout) {
          // Use stimulus duration from trial parameters or fallback to default
          const stimulusDuration = stimulusDurationMs || trialData.trial_parameters?.stimulus_duration || 800
          
          timeoutRef.current = setTimeout(() => {
            setCurrentState('RESPONSE')
            responseStartTimeRef.current = Date.now()
            
            // Set timeout for response
            timeoutRef.current = setTimeout(() => {
              // Timeout occurred
              const responseTime = Date.now() - responseStartTimeRef.current
              const result: TrialResult = {
                trial_id: trialData.trial_id,
                user_response: 'timeout',
                is_correct: false,
                response_time_ms: responseTime,
                trajectory_data: [],
                timestamp: Date.now(),
                no_response: true,
              }
              setTrialResult(result)
              setCurrentState('FEEDBACK')
              
              timeoutRef.current = setTimeout(() => {
                setCurrentState('REST')
                
                timeoutRef.current = setTimeout(() => {
                  setCurrentState('COMPLETE')
                  setIsActive(false)
                  onTrialComplete(result)
                }, restPeriodMs)
              }, feedbackDurationMs)
            }, timeoutSeconds * 1000)
          }, stimulusDuration)
        }
        // If disableStimulusTimeout is true, the stimulus will control its own completion
        // via the handleStimulusComplete callback
      }, fixationDurationMs)
    }, delay)
  }, [isActive, delayRangeMs, fixationDurationMs, restPeriodMs, feedbackDurationMs, timeoutSeconds, stimulusDurationMs, trialData.trial_id, trialData.trial_parameters?.stimulus_duration, onTrialComplete])

  const handleStimulusComplete = useCallback(() => {
    if (currentState !== 'STIMULUS') return
    
    clearTimeouts()
    setCurrentState('RESPONSE')
    responseStartTimeRef.current = Date.now()
    
    // Set timeout for response
    timeoutRef.current = setTimeout(() => {
      // Timeout occurred
      const responseTime = Date.now() - responseStartTimeRef.current
      const result: TrialResult = {
        trial_id: trialData.trial_id,
        user_response: 'timeout',
        is_correct: false,
        response_time_ms: responseTime,
        trajectory_data: [],
        timestamp: Date.now(),
        no_response: true,
      }
      setTrialResult(result)
      setCurrentState('FEEDBACK')
      
      timeoutRef.current = setTimeout(() => {
        setCurrentState('REST')
        
        timeoutRef.current = setTimeout(() => {
          setCurrentState('COMPLETE')
          setIsActive(false)
          onTrialComplete(result)
        }, restPeriodMs)
      }, feedbackDurationMs)
    }, timeoutSeconds * 1000)
  }, [currentState, trialData.trial_id, clearTimeouts, timeoutSeconds, restPeriodMs, feedbackDurationMs, onTrialComplete])

  const handleSwipeComplete = useCallback((choice: 'left' | 'right', trajectoryData: any[], responseTimeMs: number) => {
    if (currentState !== 'RESPONSE') return
    
    clearTimeouts()
    
    const isCorrect = choice.toLowerCase() === trialData.correct_answer.toLowerCase()
    
    // Debug case-insensitive comparison
    console.log('Case-insensitive comparison:', {
      user_choice: choice,
      correct_answer: trialData.correct_answer,
      user_choice_lower: choice.toLowerCase(),
      correct_answer_lower: trialData.correct_answer.toLowerCase(),
      is_correct: isCorrect
    })
    
    const result: TrialResult = {
      trial_id: trialData.trial_id,
      user_response: choice,
      is_correct: isCorrect,
      response_time_ms: responseTimeMs,
      trajectory_data: trajectoryData,
      timestamp: Date.now(),
      no_response: false,
    }
    
    // Comprehensive feedback logging
    console.log('Trial Feedback Summary:', {
      trial_id: trialData.trial_id,
      task_type: trialData.task_type,
      expected_correct_answer: trialData.correct_answer,
      user_choice: choice,
      is_correct: isCorrect,
      response_time_ms: responseTimeMs,
      coherence: trialData.trial_parameters?.coherence,
      direction: trialData.trial_parameters?.direction,
      aperture_shape: trialData.trial_parameters?.aperture_shape,
      aperture_size: trialData.trial_parameters?.aperture_size,
      dot_count: trialData.trial_parameters?.dot_count,
      stimulus_duration: trialData.trial_parameters?.stimulus_duration
    })
    
    setTrialResult(result)
    setCurrentState('FEEDBACK')
    
    timeoutRef.current = setTimeout(() => {
      setCurrentState('REST')
      
      timeoutRef.current = setTimeout(() => {
        setCurrentState('COMPLETE')
        setIsActive(false)
        onTrialComplete(result)
      }, restPeriodMs)
    }, feedbackDurationMs)
  }, [currentState, trialData.trial_id, trialData.correct_answer, clearTimeouts, restPeriodMs, feedbackDurationMs, onTrialComplete])

  const resetTrial = useCallback(() => {
    clearTimeouts()
    setCurrentState('IDLE')
    setTrialResult(null)
    setIsActive(false)
  }, [clearTimeouts])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts()
    }
  }, [clearTimeouts])

  return {
    currentState,
    trialResult,
    isActive,
    startTrial,
    handleStimulusComplete,
    handleSwipeComplete,
    resetTrial,
  }
}
