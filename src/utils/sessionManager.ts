import { Session } from '../types'
import { getCurrentStudyId, getDeviceId, saveSession, getSession, getAllSessions, getTrialsBySession } from './storage'
import { generateSessionId } from './uuid'

/**
 * Create a new session for a task
 */
export const createSession = (taskType: string): Session => {
  const session: Session = {
    session_id: generateSessionId(),
    study_id: getCurrentStudyId() || 'default-study',
    device_id: getDeviceId() || 'unknown-device',
    task_type: taskType,
    period_type: 'anytime', // No periods yet in Phase 2A
    session_date: new Date().toISOString().split('T')[0],
    started_at: Date.now(),
    completed_at: null,
    completed: false,
    is_practice: false, // No practice mode yet in Phase 2A
    is_post_study: false,
    trial_ids: []
  }
  
  return session
}

/**
 * Get a session by ID
 */
export const getSessionById = (sessionId: string): Session | null => {
  return getSession(sessionId)
}

/**
 * Get all sessions
 */
export const getAllSessionsData = (): Session[] => {
  return getAllSessions()
}

/**
 * Get sessions by task type
 */
export const getSessionsByTask = (taskType: string): Session[] => {
  const allSessions = getAllSessions()
  return allSessions.filter(session => session.task_type === taskType)
}

/**
 * Get completed sessions
 */
export const getCompletedSessions = (): Session[] => {
  const allSessions = getAllSessions()
  return allSessions.filter(session => session.completed)
}

/**
 * Save a session
 */
export const saveSessionData = (session: Session): void => {
  saveSession(session)
}

/**
 * Complete a session with trials
 */
export const completeSession = (sessionId: string, trials: any[]): void => {
  const session = getSession(sessionId)
  if (!session) {
    console.error('Session not found:', sessionId)
    return
  }
  
  // Update session with completion data
  const updatedSession: Session = {
    ...session,
    completed: true,
    completed_at: Date.now(),
    trial_ids: trials.map(trial => trial.trial_id)
  }
  
  saveSession(updatedSession)
  console.log(`Session ${sessionId} completed with ${trials.length} trials`)
}

/**
 * Abandon a session (mark as incomplete)
 */
export const abandonSession = (sessionId: string): void => {
  const session = getSession(sessionId)
  if (!session) {
    console.error('Session not found:', sessionId)
    return
  }
  
  // Mark as abandoned but don't delete
  const updatedSession: Session = {
    ...session,
    completed: false,
    completed_at: Date.now() // Still record when it was abandoned
  }
  
  saveSession(updatedSession)
  console.log(`Session ${sessionId} abandoned`)
}

/**
 * Get the last session time for grace period calculations
 */
export const getLastSessionTime = (): number | null => {
  const allSessions = getAllSessions()
  if (allSessions.length === 0) {
    return null
  }
  
  // Get the most recent session start time
  const sortedSessions = allSessions.sort((a, b) => b.started_at - a.started_at)
  return sortedSessions[0].started_at
}

/**
 * Get sessions for a specific date
 */
export const getSessionsForDate = (date: string): Session[] => {
  const allSessions = getAllSessions()
  return allSessions.filter(session => session.session_date === date)
}

/**
 * Get session statistics
 */
export const getSessionStats = (): {
  totalSessions: number
  completedSessions: number
  totalTrials: number
  averageTrialsPerSession: number
} => {
  const allSessions = getAllSessions()
  const completedSessions = allSessions.filter(s => s.completed)
  
  const totalTrials = allSessions.reduce((sum, session) => sum + session.trial_ids.length, 0)
  const averageTrialsPerSession = allSessions.length > 0 ? totalTrials / allSessions.length : 0
  
  return {
    totalSessions: allSessions.length,
    completedSessions: completedSessions.length,
    totalTrials,
    averageTrialsPerSession: Math.round(averageTrialsPerSession * 100) / 100
  }
}

/**
 * Check if a session is currently active (not completed and not abandoned)
 */
export const isSessionActive = (sessionId: string): boolean => {
  const session = getSession(sessionId)
  return session ? !session.completed && !session.completed_at : false
}

/**
 * Get the current active session (if any)
 */
export const getCurrentActiveSession = (): Session | null => {
  const allSessions = getAllSessions()
  const activeSession = allSessions.find(session => isSessionActive(session.session_id))
  return activeSession || null
}
