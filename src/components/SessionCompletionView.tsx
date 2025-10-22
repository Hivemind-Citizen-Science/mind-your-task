import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, typography, spacing } from '../theme'

export interface SessionStats {
  totalTrials: number
  correct: number
  accuracy: number
  avgResponseTime: number
  fastest: number
  slowest: number
}

export interface SyncStatus {
  isOnline: boolean
  pendingTrials: number
  lastSyncAttempt: number | null
}

export interface SessionCompletionViewProps {
  session: {
    task_type: string
    started_at: number
  }
  stats: SessionStats
  syncStatus: SyncStatus
  trials: Array<{ synced: boolean }>
  isLoading: boolean
  onReturnHome: () => void
}

const TASK_NAMES = {
  calibration: 'Calibration',
  dot_kinematogram: 'Random Dot Motion',
  halo_travel: 'Halo Travel'
}

export const SessionCompletionView: React.FC<SessionCompletionViewProps> = ({
  session,
  stats,
  syncStatus,
  trials,
  isLoading,
  onReturnHome
}) => {
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString()
  }

  if (isLoading) {
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
          onPress={onReturnHome}
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
