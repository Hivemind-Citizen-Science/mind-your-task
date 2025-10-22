import { Trial, SyncState } from '../types'
import { saveTrial, getTrial, getUnsyncedTrials, markTrialAsSynced, getSyncState, setSyncState, getDeviceId } from './storage'
import { postTrials, postSession } from '../services/apiService'
import { getSessionById } from './sessionManager'

// Sync queue management
let syncQueue: string[] = []
let isSyncing = false
let retryTimeout: NodeJS.Timeout | null = null

/**
 * Save trial locally and queue for sync
 */
export const saveTrialAndQueue = (trial: Trial): void => {
  // Save to local storage
  saveTrial(trial)
  
  // Add to sync queue if not already synced
  if (!trial.synced) {
    addToSyncQueue(trial.trial_id)
  }
  
  // Attempt immediate sync (non-blocking)
  // TODO: Uncomment when backend is ready
  // syncTrialsToBackend().catch(err => {
  //   console.log('Initial sync attempt failed, will retry:', err)
  // })
}

/**
 * Add trial to sync queue
 */
export const addToSyncQueue = (trialId: string): void => {
  if (!syncQueue.includes(trialId)) {
    syncQueue.push(trialId)
    console.log(`Added trial ${trialId} to sync queue`)
  }
}

/**
 * Remove trial from sync queue
 */
export const removeFromSyncQueue = (trialId: string): void => {
  const index = syncQueue.indexOf(trialId)
  if (index > -1) {
    syncQueue.splice(index, 1)
    console.log(`Removed trial ${trialId} from sync queue`)
  }
}

/**
 * Get current sync queue
 */
export const getSyncQueue = (): string[] => {
  return [...syncQueue]
}

/**
 * Get queued trials for syncing
 */
export const getQueuedTrials = (): Trial[] => {
  const queuedTrials: Trial[] = []
  
  for (const trialId of syncQueue) {
    const trial = getTrial(trialId)
    if (trial && !trial.synced) {
      queuedTrials.push(trial)
    }
  }
  
  return queuedTrials
}

/**
 * Sync trials to backend with retry logic
 */
export const syncTrialsToBackend = async (): Promise<void> => {
  if (isSyncing) {
    console.log('Sync already in progress, skipping')
    return
  }
  
  const queuedTrials = getQueuedTrials()
  if (queuedTrials.length === 0) {
    console.log('No trials to sync')
    return
  }
  
  isSyncing = true
  
  try {
    // Group trials by session for efficient syncing
    const trialsBySession = groupTrialsBySession(queuedTrials)
    
    // Sync each session's trials
    for (const [sessionId, trials] of Object.entries(trialsBySession)) {
      const session = getSessionById(sessionId)
      if (!session) {
        console.error(`Session ${sessionId} not found for trial sync`)
        continue
      }
      
      // Post session metadata first (if not already synced)
      // TODO: Uncomment when backend is ready
      // if (!session.completed) {
      //   try {
      //     await postSession({
      //       session,
      //       device_id: getDeviceId() || 'unknown-device',
      //       study_id: session.study_id
      //     })
      //   } catch (error) {
      //     console.log('Session metadata sync failed, continuing with trials:', error)
      //   }
      // }
      
      // Post trials for this session
      // TODO: Uncomment when backend is ready
      // await postTrials({
      //   trials,
      //   session_id: sessionId,
      //   device_id: getDeviceId() || 'unknown-device'
      // })
      
      // Mark trials as synced
      trials.forEach(trial => {
        markTrialAsSynced(trial.trial_id)
        removeFromSyncQueue(trial.trial_id)
      })
      
      console.log(`Synced ${trials.length} trials for session ${sessionId}`)
    }
    
    // Update sync state
    updateSyncState(true, Date.now())
    
  } catch (error) {
    console.error('Sync failed, will retry:', error)
    updateSyncState(false, Date.now())
    scheduleRetry()
  } finally {
    isSyncing = false
  }
}

/**
 * Group trials by session ID
 */
const groupTrialsBySession = (trials: Trial[]): Record<string, Trial[]> => {
  const grouped: Record<string, Trial[]> = {}
  
  trials.forEach(trial => {
    if (!grouped[trial.session_id]) {
      grouped[trial.session_id] = []
    }
    grouped[trial.session_id].push(trial)
  })
  
  return grouped
}

/**
 * Update sync state
 */
const updateSyncState = (success: boolean, timestamp: number): void => {
  const currentState = getSyncState() || {
    trial_ids: [],
    last_sync_attempt: 0,
    retry_count: 0
  }
  
  const newState: SyncState = {
    ...currentState,
    trial_ids: syncQueue,
    last_sync_attempt: timestamp,
    retry_count: success ? 0 : currentState.retry_count + 1
  }
  
  setSyncState(newState)
}

/**
 * Schedule retry with exponential backoff
 */
const scheduleRetry = (): void => {
  if (retryTimeout) {
    clearTimeout(retryTimeout)
  }
  
  const currentState = getSyncState()
  const retryCount = currentState?.retry_count || 0
  
  // Exponential backoff: 5s, 30s, 2min, 10min, 1hour, 24hours
  const delays = [5000, 30000, 120000, 600000, 3600000, 86400000]
  const delay = delays[Math.min(retryCount, delays.length - 1)]
  
  console.log(`Scheduling retry in ${delay / 1000} seconds (attempt ${retryCount + 1})`)
  
  // TODO: Uncomment when backend is ready
  // retryTimeout = setTimeout(() => {
  //   syncTrialsToBackend().catch(err => {
  //     console.error('Retry sync failed:', err)
  //   })
  // }, delay)
}

/**
 * Force sync all pending data
 */
export const forceSyncAll = async (): Promise<void> => {
  console.log('Force syncing all pending data...')
  
  // Clear any existing retry timeout
  if (retryTimeout) {
    clearTimeout(retryTimeout)
    retryTimeout = null
  }
  
  // Reset sync state
  const currentState = getSyncState()
  if (currentState) {
    setSyncState({
      ...currentState,
      retry_count: 0
    })
  }
  
  // Attempt sync
  // TODO: Uncomment when backend is ready
  // await syncTrialsToBackend()
}

/**
 * Get sync status
 */
export const getSyncStatus = (): {
  isOnline: boolean
  pendingTrials: number
  lastSyncAttempt: number | null
  retryCount: number
} => {
  const syncState = getSyncState()
  const queuedTrials = getQueuedTrials()
  
  return {
    isOnline: !isSyncing && queuedTrials.length === 0,
    pendingTrials: queuedTrials.length,
    lastSyncAttempt: syncState?.last_sync_attempt || null,
    retryCount: syncState?.retry_count || 0
  }
}

/**
 * Initialize sync manager (call on app start)
 */
export const initializeSyncManager = (): void => {
  console.log('Initializing trial sync manager...')
  
  // Load existing sync queue from storage
  const syncState = getSyncState()
  if (syncState?.trial_ids) {
    syncQueue = [...syncState.trial_ids]
    console.log(`Loaded ${syncQueue.length} trials from sync queue`)
  }
  
  // Attempt initial sync
  // TODO: Uncomment when backend is ready
  // syncTrialsToBackend().catch(err => {
  //   console.log('Initial sync failed, will retry:', err)
  // })
}

/**
 * Clean up sync manager (call on app shutdown)
 */
export const cleanupSyncManager = (): void => {
  if (retryTimeout) {
    clearTimeout(retryTimeout)
    retryTimeout = null
  }
  
  // Save current sync queue
  const syncState = getSyncState()
  if (syncState) {
    setSyncState({
      ...syncState,
      trial_ids: syncQueue
    })
  }
}
