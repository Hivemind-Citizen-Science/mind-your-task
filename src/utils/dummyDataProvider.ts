import { Session, Trial } from '../types'
import { SessionStats, SyncStatus } from '../components/SessionCompletionView'

// Dummy session data
export const createDummySession = (): Session => ({
  session_id: 'dummy-session-123',
  user_id: 'dummy-user',
  task_type: 'dot_kinematogram',
  started_at: Date.now() - 300000, // 5 minutes ago
  completed_at: Date.now(),
  status: 'completed',
  total_trials: 20,
  completed_trials: 20,
  correct_trials: 16,
  accuracy: 80,
  avg_response_time: 1200,
  device_info: {
    platform: 'iOS',
    version: '17.0',
    model: 'iPhone 15 Pro'
  },
  study_config: {
    study_id: 'dummy-study',
    version: '1.0.0',
    created_at: Date.now() - 86400000
  }
})

// Dummy trials data
export const createDummyTrials = (sessionId: string): Trial[] => {
  const trials: Trial[] = []
  for (let i = 0; i < 20; i++) {
    trials.push({
      trial_id: `dummy-trial-${i + 1}`,
      session_id: sessionId,
      user_id: 'dummy-user',
      trial_index: i,
      task_type: 'dot_kinematogram',
      trial_parameters: {
        coherence: 0.5,
        direction: i % 2 === 0 ? 'left' : 'right',
        duration: 1000
      },
      user_response: i % 2 === 0 ? 'left' : 'right',
      correct_answer: i % 2 === 0 ? 'left' : 'right',
      is_correct: i < 16, // First 16 are correct
      response_time_ms: 800 + Math.random() * 1000, // Random between 800-1800ms
      trajectory_data: [],
      feedback_shown: 'green',
      no_response: false,
      timestamp: Date.now() - (20 - i) * 10000, // Staggered timestamps
      synced: i < 18 // First 18 are synced
    })
  }
  return trials
}

// Dummy sync status
export const createDummySyncStatus = (): SyncStatus => ({
  isOnline: true,
  pendingTrials: 2,
  lastSyncAttempt: Date.now() - 60000 // 1 minute ago
})

// Calculate dummy stats
export const calculateDummyStats = (trials: Trial[]): SessionStats => {
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

// Check if we should use dummy data (for showcase/demo purposes)
export const shouldUseDummyData = (sessionId: string): boolean => {
  return sessionId === 'dummy-session-123' || sessionId.startsWith('dummy-')
}
