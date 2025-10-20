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
}

export const useTrialStateMachine = ({
  trialData,
  onTrialComplete,
  timeoutSeconds = 5,
  delayRangeMs = [700, 1000],
  fixationDurationMs = 300,
  restPeriodMs = 300,
  feedbackDurationMs = 300,
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
        }, 800) // Stimulus duration
      }, fixationDurationMs)
    }, delay)
  }, [isActive, delayRangeMs, fixationDurationMs, restPeriodMs, feedbackDurationMs, timeoutSeconds, trialData.trial_id, onTrialComplete])

  const handleSwipeComplete = useCallback((choice: 'left' | 'right', trajectoryData: any[], responseTimeMs: number) => {
    if (currentState !== 'RESPONSE') return
    
    clearTimeouts()
    
    const isCorrect = choice === trialData.correct_answer
    const result: TrialResult = {
      trial_id: trialData.trial_id,
      user_response: choice,
      is_correct: isCorrect,
      response_time_ms: responseTimeMs,
      trajectory_data: trajectoryData,
      timestamp: Date.now(),
      no_response: false,
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
    handleSwipeComplete,
    resetTrial,
  }
}
