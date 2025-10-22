import React, { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native'
import { RootStackParamList } from '../types'
import { getSessionById } from '../utils/sessionManager'
import { getTrialsBySession } from '../utils/storage'
import { getSyncStatus } from '../utils/trialSyncManager'
import { Session, Trial } from '../types'
import { SessionCompletionView, SessionStats, SyncStatus } from './SessionCompletionView'
import { 
  shouldUseDummyData, 
  createDummySession, 
  createDummyTrials, 
  createDummySyncStatus, 
  calculateDummyStats 
} from '../utils/dummyDataProvider'

type SessionCompletionRouteProp = RouteProp<{
  params: {
    sessionId?: string
  }
}, 'params'>

export const SessionCompletionContainer: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const route = useRoute<SessionCompletionRouteProp>()
  const sessionId = route.params?.sessionId || 'dummy-session-123' // Default to dummy data if no sessionId provided
  
  const [session, setSession] = useState<Session | null>(null)
  const [trials, setTrials] = useState<Trial[]>([])
  const [stats, setStats] = useState<SessionStats | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    pendingTrials: 0,
    lastSyncAttempt: null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSessionData = () => {
      // Check if we should use dummy data
      if (shouldUseDummyData(sessionId)) {
        const dummySession = createDummySession()
        const dummyTrials = createDummyTrials(sessionId)
        const dummySyncStatus = createDummySyncStatus()
        
        setSession(dummySession)
        setTrials(dummyTrials)
        setStats(calculateDummyStats(dummyTrials))
        setSyncStatus(dummySyncStatus)
        setIsLoading(false)
        return
      }

      // Use real data
      const sessionData = getSessionById(sessionId)
      if (!sessionData) {
        Alert.alert('Error', 'Session not found')
        navigation.navigate('Home')
        return
      }

      setSession(sessionData)
      const sessionTrials = getTrialsBySession(sessionId)
      setTrials(sessionTrials)
      
      // Calculate stats
      const sessionStats = calculateSessionStats(sessionTrials)
      setStats(sessionStats)
      
      // Get sync status
      const sync = getSyncStatus()
      setSyncStatus(sync)
      
      setIsLoading(false)
    }

    loadSessionData()
  }, [sessionId, navigation])

  const calculateSessionStats = (trials: Trial[]): SessionStats => {
    if (trials.length === 0) {
      return {
        totalTrials: 0,
        correct: 0,
        accuracy: 0,
        avgResponseTime: 0,
        fastest: 0,
        slowest: 0
      }
    }

    const correct = trials.filter(t => t.is_correct).length
    const accuracy = (correct / trials.length) * 100
    const avgResponseTime = Math.round(
      trials.reduce((sum, t) => sum + t.response_time_ms, 0) / trials.length
    )
    const responseTimes = trials.map(t => t.response_time_ms)
    
    return {
      totalTrials: trials.length,
      correct,
      accuracy: Math.round(accuracy),
      avgResponseTime,
      fastest: Math.min(...responseTimes),
      slowest: Math.max(...responseTimes)
    }
  }

  const handleReturnHome = () => {
    navigation.navigate('Home')
  }

  if (!session || !stats) {
    return (
      <SessionCompletionView
        session={{ task_type: '', started_at: 0 }}
        stats={{
          totalTrials: 0,
          correct: 0,
          accuracy: 0,
          avgResponseTime: 0,
          fastest: 0,
          slowest: 0
        }}
        syncStatus={syncStatus}
        trials={[]}
        isLoading={isLoading}
        onReturnHome={handleReturnHome}
      />
    )
  }

  return (
    <SessionCompletionView
      session={session}
      stats={stats}
      syncStatus={syncStatus}
      trials={trials}
      isLoading={isLoading}
      onReturnHome={handleReturnHome}
    />
  )
}
