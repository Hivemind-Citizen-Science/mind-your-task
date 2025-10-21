import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { colors, typography, spacing } from '../../theme'

interface TaskCardProps {
  taskName: string
  estimatedDuration: string
  lastCompleted: string | null
  isAvailable: boolean
  isRunning: boolean
  onPress: () => void
  showNewBadge?: boolean
}

export const TaskCard: React.FC<TaskCardProps> = ({
  taskName,
  estimatedDuration,
  lastCompleted,
  isAvailable,
  isRunning,
  onPress,
  showNewBadge = false
}) => {
  const getCardStyle = () => {
    if (!isAvailable) {
      return [styles.card, styles.disabledCard]
    }
    if (isRunning) {
      return [styles.card, styles.runningCard]
    }
    return styles.card
  }

  const getTextStyle = () => {
    if (!isAvailable) {
      return [styles.taskName, styles.disabledText]
    }
    return styles.taskName
  }

  return (
    <TouchableOpacity
      style={getCardStyle()}
      onPress={onPress}
      disabled={!isAvailable || isRunning}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={getTextStyle()}>{taskName}</Text>
        {showNewBadge && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        )}
      </View>
      
      <View style={styles.details}>
        <Text style={styles.duration}>⏱️ {estimatedDuration}</Text>
        <Text style={styles.lastCompleted}>
          {lastCompleted ? `Last: ${lastCompleted}` : 'Never completed'}
        </Text>
      </View>
      
      {isRunning && (
        <View style={styles.runningIndicator}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.runningText}>Running...</Text>
        </View>
      )}
      
      {!isAvailable && (
        <View style={styles.unavailableIndicator}>
          <Text style={styles.unavailableText}>Not available</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledCard: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  runningCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  taskName: {
    ...typography.heading3,
    color: colors.textPrimary,
    flex: 1,
  },
  disabledText: {
    color: colors.textSecondary,
  },
  newBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  newBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    ...typography.body,
    color: colors.textSecondary,
  },
  lastCompleted: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  runningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  runningText: {
    ...typography.caption,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  unavailableIndicator: {
    marginTop: spacing.sm,
  },
  unavailableText: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
  },
})
