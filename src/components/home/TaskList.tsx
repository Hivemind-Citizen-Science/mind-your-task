import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { TaskCard } from './TaskCard'
import { colors, typography, spacing } from '../../theme'

interface Task {
  id: string
  name: string
  estimatedDuration: string
  lastCompleted: string | null
  isAvailable: boolean
  isRunning: boolean
  showNewBadge?: boolean
}

interface TaskListProps {
  tasks: Task[]
  onTaskPress: (taskId: string) => void
  title?: string
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskPress,
  title = 'Available Tasks'
}) => {
  if (tasks.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No Tasks Available</Text>
        <Text style={styles.emptyMessage}>
          Check back during the next time period
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            taskName={task.name}
            estimatedDuration={task.estimatedDuration}
            lastCompleted={task.lastCompleted}
            isAvailable={task.isAvailable}
            isRunning={task.isRunning}
            showNewBadge={task.showNewBadge}
            onPress={() => onTaskPress(task.id)}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
})
