import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useFocusEffect, NavigationProp } from '@react-navigation/native'
import { RootStackParamList } from '../types'
import { colors } from '../theme'
import { StatusBar } from '../components/home/StatusBar'
import { TaskList } from '../components/home/TaskList'
import { getStudyConfig, getThreeWordPhrase, getAppState } from '../utils/storage'
import { getSessionsByTask } from '../utils/sessionManager'
import { getSyncStatus, forceSyncAll } from '../utils/trialSyncManager'

interface Task {
  id: string
  name: string
  estimatedDuration: string
  lastCompleted: string | null
  isAvailable: boolean
  isRunning: boolean
  showNewBadge?: boolean
}

const TASK_CONFIGS = {
  calibration: {
    name: 'Calibration',
    estimatedDuration: '~2 min'
  },
  dot_kinematogram: {
    name: 'Random Dot Motion',
    estimatedDuration: '~5 min'
  },
  halo_travel: {
    name: 'Halo Travel',
    estimatedDuration: '~5 min'
  }
}

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [tasks, setTasks] = useState<Task[]>([])
  const [syncStatus, setSyncStatus] = useState({
    isOnline: true,
    pendingTrials: 0,
    lastSyncAttempt: null as number | null
  })
  const [studyProgress, setStudyProgress] = useState<{
    currentDay: number
    totalDays: number
  } | null>(null)

  const loadTasks = useCallback(() => {
    const config = getStudyConfig()
    const appState = getAppState()
    
    if (!config) {
      console.error('No study config found')
      return
    }

    const activeTasks = config.active_tasks || ['calibration', 'dot_kinematogram', 'halo_travel']
    const tasksData: Task[] = []

    activeTasks.forEach(taskId => {
      const taskConfig = TASK_CONFIGS[taskId as keyof typeof TASK_CONFIGS]
      if (!taskConfig) return

      // Get last completed session for this task
      const sessions = getSessionsByTask(taskId)
      const completedSessions = sessions.filter(s => s.completed)
      const lastCompleted = completedSessions.length > 0 
        ? formatLastCompleted(completedSessions[0].completed_at!)
        : null

      // Check if task has been practiced (for new badge)
      const hasBeenPracticed = appState?.tasks_practiced?.includes(taskId) || false
      const showNewBadge = !hasBeenPracticed && completedSessions.length === 0

      tasksData.push({
        id: taskId,
        name: taskConfig.name,
        estimatedDuration: taskConfig.estimatedDuration,
        lastCompleted,
        isAvailable: true, // No time restrictions in Phase 2A
        isRunning: false, // TODO: Track running sessions
        showNewBadge
      })
    })

    setTasks(tasksData)
  }, [])

  const loadSyncStatus = useCallback(() => {
    const status = getSyncStatus()
    setSyncStatus({
      isOnline: status.isOnline,
      pendingTrials: status.pendingTrials,
      lastSyncAttempt: status.lastSyncAttempt
    })
  }, [])

  const loadStudyProgress = useCallback(() => {
    const appState = getAppState()
    const config = getStudyConfig()
    
    if (appState?.study_start_date && config) {
      const startDate = new Date(appState.study_start_date)
      const now = new Date()
      const diffTime = now.getTime() - startDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      setStudyProgress({
        currentDay: Math.max(1, diffDays),
        totalDays: config.duration_days
      })
    }
  }, [])

  const handleTaskPress = useCallback((taskId: string) => {
    // Navigate to task screen
    navigation.navigate('Task', { taskType: taskId as 'calibration' | 'dot_kinematogram' | 'halo_travel' })
  }, [navigation])

  const handleSyncPress = useCallback(async () => {
    // TODO: Uncomment when backend is ready
    // try {
    //   await forceSyncAll()
    //   loadSyncStatus()
    //   Alert.alert('Sync Complete', 'All data has been synced to the server.')
    // } catch (error) {
    //   Alert.alert('Sync Failed', 'Unable to sync data. Please try again later.')
    // }
    
    // Temporary: Show message that sync is disabled
    Alert.alert('Sync Disabled', 'API sync is temporarily disabled during development.')
  }, [loadSyncStatus])

  // Load data when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadTasks()
      loadSyncStatus()
      loadStudyProgress()
    }, [loadTasks, loadSyncStatus, loadStudyProgress])
  )

  // Update sync status periodically
  useEffect(() => {
    const interval = setInterval(loadSyncStatus, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [loadSyncStatus])

  const config = getStudyConfig()
  const threeWordPhrase = getThreeWordPhrase()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        studyProgress={studyProgress ?? undefined}
        studyName={config?.study_name || 'Perceptual Decision Making'}
        threeWordPhrase={threeWordPhrase ?? undefined}
        syncStatus={syncStatus}
        onSyncPress={handleSyncPress}
      />
      
      <TaskList
        tasks={tasks}
        onTaskPress={handleTaskPress}
      />
    </SafeAreaView>
  )
}

const formatLastCompleted = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days}d ago`
  } else if (hours > 0) {
    return `${hours}h ago`
  } else if (minutes > 0) {
    return `${minutes}m ago`
  } else {
    return 'Just now'
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
})
