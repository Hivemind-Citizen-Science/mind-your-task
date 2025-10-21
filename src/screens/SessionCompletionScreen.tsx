import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native'
import { RootStackParamList } from '../types'
import { colors, typography, spacing } from '../theme'
import { getSessionById } from '../utils/sessionManager'
import { getTrialsBySession } from '../utils/storage'
import { getSyncStatus } from '../utils/trialSyncManager'
import { Session, Trial } from '../types'

type SessionCompletionRouteProp = RouteProp<{
  params: {
    sessionId: string
  }
}, 'params'>

interface SessionStats {
  totalTrials: number
  correct: number
  accuracy: number
  avgResponseTime: number
  fastest: number
  slowest: number
}

const TASK_NAMES = {
  calibration: 'Calibration',
  dot_kinematogram: 'Random Dot Motion',
  halo_travel: 'Halo Travel'
}

export const SessionCompletionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const route = useRoute<SessionCompletionRouteProp>()
  const { sessionId } = route.params
  
  const [session, setSession] = useState<Session | null>(null)
  const [trials, setTrials] = useState<Trial[]>([])
  const [stats, setStats] = useState<SessionStats | null>(null)
  const [syncStatus, setSyncStatus] = useState({
    isOnline: true,
    pendingTrials: 0,
    lastSyncAttempt: null as number | null
  })

  useEffect(() => {
    const loadSessionData = () => {
      const sessionData = getSessionById(sessionId)
      if (!sessionData) {
        Alert.alert('Error', 'Session not found')
        navigation.navigate('Home')
        return
      }

      setSession(sessionData)
      setTrials(getTrialsBySession(sessionId))
      
      // Calculate stats
      const sessionStats = calculateSessionStats(getTrialsBySession(sessionId))
      setStats(sessionStats)
      
      // Get sync status
      const sync = getSyncStatus()
      setSyncStatus(sync)
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

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString()
  }

  if (!session || !stats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading session data...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Celebration */}
        <View style={styles.celebrationContainer}>
          <Text style={styles.celebration}>Session Complete! 🎉</Text>
        </View>
        
        {/* Task Info */}
        <View style={styles.taskInfo}>
          <Text style={styles.taskName}>
            {TASK_NAMES[session.task_type as keyof typeof TASK_NAMES] || session.task_type}
          </Text>
          <Text style={styles.timestamp}>
            {formatTime(session.started_at)}
          </Text>
        </View>
        
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Correct</Text>
            <Text style={styles.statValue}>
              {stats.correct}/{stats.totalTrials}
            </Text>
            <Text style={styles.statSubValue}>
              {stats.accuracy}%
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Avg Response</Text>
            <Text style={styles.statValue}>
              {stats.avgResponseTime}ms
            </Text>
            <Text style={styles.statSubValue}>
              {stats.fastest}-{stats.slowest}ms
            </Text>
          </View>
        </View>
        
        {/* Sync Status */}
        <View style={styles.syncInfo}>
          <Text style={styles.syncLabel}>Data Sync Status</Text>
          <Text style={styles.syncStatus}>
            {trials.every(t => t.synced) 
              ? '✓ All data synced to server' 
              : '⟳ Syncing to server...'
            }
          </Text>
          {syncStatus.pendingTrials > 0 && (
            <Text style={styles.pendingText}>
              {syncStatus.pendingTrials} trials pending sync
            </Text>
          )}
        </View>
        
        {/* Return Button */}
        <TouchableOpacity 
          style={styles.returnButton}
          onPress={handleReturnHome}
        >
          <Text style={styles.returnButtonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  celebration: {
    ...typography.heading1,
    color: colors.primary,
    textAlign: 'center',
  },
  taskInfo: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  taskName: {
    ...typography.heading2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  timestamp: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statSubValue: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  syncInfo: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  syncLabel: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  syncStatus: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  pendingText: {
    ...typography.caption,
    color: colors.warning,
    textAlign: 'center',
  },
  returnButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
  },
  returnButtonText: {
    ...typography.heading3,
    color: '#FFFFFF',
  },
})
