import { Session, Trial } from '../types'
import { saveSession, saveTrial } from './storage'

// Generate test data for ResultsDisplayScreen demonstration
export const generateTestData = () => {
  const testSessions: Session[] = []
  const testTrials: Trial[] = []

  // Generate 3 test sessions
  for (let i = 0; i < 3; i++) {
    const sessionId = `test-session-${i + 1}`
    const session: Session = {
      session_id: sessionId,
      study_id: 'test-study',
      device_id: 'test-device',
      task_type: i === 0 ? 'dot_kinematogram' : i === 1 ? 'halo_travel' : 'calibration',
      period_type: i === 0 ? 'morning' : i === 1 ? 'afternoon' : 'evening',
      session_date: new Date(Date.now() - (i * 86400000)).toISOString().split('T')[0],
      started_at: Date.now() - (i * 86400000) - 1800000, // 30 minutes ago
      completed_at: Date.now() - (i * 86400000),
      completed: true,
      is_practice: i === 2,
      is_post_study: false,
      trial_ids: []
    }
    testSessions.push(session)

    // Generate trials for this session
    const trialCount = Math.floor(Math.random() * 15) + 10 // 10-24 trials
    for (let j = 0; j < trialCount; j++) {
      const isCorrect = Math.random() > 0.3 // 70% accuracy
      const responseTime = Math.floor(Math.random() * 2000) + 500 // 500-2500ms
      
      const trial: Trial = {
        trial_id: `test-trial-${sessionId}-${j + 1}`,
        session_id: sessionId,
        task_type: session.task_type,
        trial_number: j + 1,
        trial_parameters: {
          coherence: Math.random() * 0.5 + 0.1,
          direction: Math.random() > 0.5 ? 'left' : 'right'
        },
        user_response: Math.random() > 0.1 ? (Math.random() > 0.5 ? 'left' : 'right') : '',
        correct_answer: Math.random() > 0.5 ? 'left' : 'right',
        is_correct: isCorrect,
        response_time_ms: responseTime,
        trajectory_data: generateMockTrajectory(),
        feedback_shown: isCorrect ? 'green' : 'red',
        no_response: Math.random() > 0.9, // 10% no response
        timestamp: Date.now() - (Math.random() * 1800000), // Within last 30 minutes
        synced: Math.random() > 0.2 // 80% synced
      }
      testTrials.push(trial)
      session.trial_ids.push(trial.trial_id)
    }
  }

  // Save all sessions and trials to storage
  testSessions.forEach(session => saveSession(session))
  testTrials.forEach(trial => saveTrial(trial))

  console.log(`Generated ${testSessions.length} test sessions and ${testTrials.length} test trials`)
  return { sessions: testSessions, trials: testTrials }
}

const generateMockTrajectory = () => {
  const points = []
  const pointCount = Math.floor(Math.random() * 20) + 10
  
  for (let i = 0; i < pointCount; i++) {
    points.push({
      x: Math.random() * 300 + 50,
      y: Math.random() * 500 + 100,
      timestamp: Date.now() - (pointCount - i) * 16 // 60fps
    })
  }
  
  return points
}

// Function to clear test data
export const clearTestData = () => {
  // This would need to be implemented based on your storage structure
  console.log('Test data cleared')
}
