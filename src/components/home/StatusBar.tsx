import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, typography, spacing } from '../../theme'

interface StatusBarProps {
  studyProgress?: {
    currentDay: number
    totalDays: number
  }
  studyName: string
  threeWordPhrase?: string
  syncStatus: {
    isOnline: boolean
    pendingTrials: number
    lastSyncAttempt: number | null
  }
  onSyncPress?: () => void
}

export const StatusBar: React.FC<StatusBarProps> = ({
  studyProgress,
  studyName,
  threeWordPhrase,
  syncStatus,
  onSyncPress
}) => {
  const getSyncStatusText = () => {
    if (syncStatus.isOnline) {
      return 'All synced'
    }
    if (syncStatus.pendingTrials > 0) {
      return `Syncing (${syncStatus.pendingTrials} pending)`
    }
    return 'Sync pending'
  }

  const getSyncStatusColor = () => {
    if (syncStatus.isOnline) {
      return colors.success
    }
    if (syncStatus.pendingTrials > 0) {
      return colors.warning
    }
    return colors.error
  }

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return 'Never'
    
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ago`
    } else if (minutes > 0) {
      return `${minutes}m ago`
    } else {
      return 'Just now'
    }
  }

  return (
    <View style={styles.container}>
      {/* Study Progress */}
      <View style={styles.studyInfo}>
        {studyProgress && (
          <Text style={styles.progressText}>
            Day {studyProgress.currentDay} of {studyProgress.totalDays}
          </Text>
        )}
        <Text style={styles.studyName}>{studyName}</Text>
        {threeWordPhrase && (
          <Text style={styles.phraseText}>{threeWordPhrase}</Text>
        )}
      </View>
      
      {/* Sync Status */}
      <TouchableOpacity 
        style={styles.syncStatus} 
        onPress={onSyncPress}
        disabled={!onSyncPress}
      >
        <View style={[styles.syncDot, { backgroundColor: getSyncStatusColor() }]} />
        <Text style={styles.syncText}>{getSyncStatusText()}</Text>
        {syncStatus.lastSyncAttempt && (
          <Text style={styles.lastSyncText}>
            Last: {formatLastSync(syncStatus.lastSyncAttempt)}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  studyInfo: {
    marginBottom: spacing.sm,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  studyName: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  phraseText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  syncText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  lastSyncText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
})
