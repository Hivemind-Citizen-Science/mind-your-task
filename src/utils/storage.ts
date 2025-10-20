import { Platform } from 'react-native'
import { MMKV } from 'react-native-mmkv'
import { StudyConfig, Session, Trial, AppState, SyncState, NotificationState } from '../types'
import { StorageError } from './storage.types'

// Platform detection
const isWeb = Platform.OS === 'web'

// Initialize MMKV for mobile platforms
let mmkv: MMKV | null = null
if (!isWeb) {
  mmkv = new MMKV()
}

// Web storage helpers
const webStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key)
    }
    return null
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value)
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key)
    }
  },
  clear: (): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear()
    }
  }
}

// Generic storage interface
class StorageService {
  private getItem(key: string): string | null {
    try {
      if (isWeb) {
        return webStorage.getItem(key)
      } else {
        return mmkv?.getString(key) || null
      }
    } catch (error) {
      console.error('Storage getItem error:', error)
      return null
    }
  }

  private setItem(key: string, value: string): void {
    try {
      if (isWeb) {
        webStorage.setItem(key, value)
      } else {
        mmkv?.set(key, value)
      }
    } catch (error) {
      console.error('Storage setItem error:', error)
      throw new Error(`Failed to store ${key}: ${error}`)
    }
  }

  private removeItem(key: string): void {
    try {
      if (isWeb) {
        webStorage.removeItem(key)
      } else {
        mmkv?.delete(key)
      }
    } catch (error) {
      console.error('Storage removeItem error:', error)
    }
  }

  // Generic JSON operations
  private getJSON<T>(key: string): T | null {
    const value = this.getItem(key)
    if (!value) return null
    
    try {
      return JSON.parse(value) as T
    } catch (error) {
      console.error(`Failed to parse JSON for key ${key}:`, error)
      return null
    }
  }

  private setJSON<T>(key: string, value: T): void {
    try {
      const jsonString = JSON.stringify(value)
      this.setItem(key, jsonString)
    } catch (error) {
      console.error(`Failed to stringify JSON for key ${key}:`, error)
      throw new Error(`Failed to store ${key}: ${error}`)
    }
  }

  // Device & Study operations
  getDeviceId(): string | null {
    return this.getItem('device_id')
  }

  setDeviceId(id: string): void {
    this.setItem('device_id', id)
  }

  getThreeWordPhrase(): string | null {
    return this.getItem('three_word_phrase')
  }

  setThreeWordPhrase(phrase: string): void {
    this.setItem('three_word_phrase', phrase)
  }

  getCurrentStudyId(): string | null {
    return this.getItem('current_study_id')
  }

  setCurrentStudyId(id: string): void {
    this.setItem('current_study_id', id)
  }

  // Study Config operations
  getStudyConfig(): StudyConfig | null {
    return this.getJSON<StudyConfig>('study_config')
  }

  setStudyConfig(config: StudyConfig): void {
    this.setJSON('study_config', config)
  }

  // Session operations
  getSession(sessionId: string): Session | null {
    const sessions = this.getJSON<Record<string, Session>>('sessions')
    return sessions?.[sessionId] || null
  }

  saveSession(session: Session): void {
    const sessions = this.getJSON<Record<string, Session>>('sessions') || {}
    sessions[session.session_id] = session
    this.setJSON('sessions', sessions)
  }

  getAllSessions(): Session[] {
    const sessions = this.getJSON<Record<string, Session>>('sessions')
    return sessions ? Object.values(sessions) : []
  }

  // Trial operations
  getTrial(trialId: string): Trial | null {
    const trials = this.getJSON<Record<string, Trial>>('trials')
    return trials?.[trialId] || null
  }

  saveTrial(trial: Trial): void {
    const trials = this.getJSON<Record<string, Trial>>('trials') || {}
    trials[trial.trial_id] = trial
    this.setJSON('trials', trials)
  }

  getTrialsBySession(sessionId: string): Trial[] {
    const trials = this.getJSON<Record<string, Trial>>('trials')
    if (!trials) return []
    
    return Object.values(trials).filter(trial => trial.session_id === sessionId)
  }

  getUnsyncedTrials(): Trial[] {
    const trials = this.getJSON<Record<string, Trial>>('trials')
    if (!trials) return []
    
    return Object.values(trials).filter(trial => !trial.synced)
  }

  markTrialAsSynced(trialId: string): void {
    const trial = this.getTrial(trialId)
    if (trial) {
      trial.synced = true
      this.saveTrial(trial)
    }
  }

  // App State operations
  getAppState(): AppState | null {
    return this.getJSON<AppState>('app_state')
  }

  setAppState(state: AppState): void {
    this.setJSON('app_state', state)
  }

  // Sync State operations
  getSyncState(): SyncState | null {
    return this.getJSON<SyncState>('sync_state')
  }

  setSyncState(state: SyncState): void {
    this.setJSON('sync_state', state)
  }

  // Notification State operations
  getNotificationState(): NotificationState | null {
    return this.getJSON<NotificationState>('notification_state')
  }

  setNotificationState(state: NotificationState): void {
    this.setJSON('notification_state', state)
  }

  // Utility operations
  clearAll(): void {
    try {
      if (isWeb) {
        webStorage.clear()
      } else {
        mmkv?.clearAll()
      }
    } catch (error) {
      console.error('Storage clearAll error:', error)
    }
  }

  // Debug operations
  getAllKeys(): string[] {
    if (isWeb) {
      const keys: string[] = []
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i)
        if (key) keys.push(key)
      }
      return keys
    } else {
      return mmkv?.getAllKeys() || []
    }
  }

  // Health check
  isStorageAvailable(): boolean {
    try {
      const testKey = 'storage_test'
      const testValue = 'test'
      this.setItem(testKey, testValue)
      const retrieved = this.getItem(testKey)
      this.removeItem(testKey)
      return retrieved === testValue
    } catch (error) {
      console.error('Storage health check failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const storage = new StorageService()

// Export individual functions for convenience
export const getDeviceId = () => storage.getDeviceId()
export const setDeviceId = (id: string) => storage.setDeviceId(id)
export const getThreeWordPhrase = () => storage.getThreeWordPhrase()
export const setThreeWordPhrase = (phrase: string) => storage.setThreeWordPhrase(phrase)
export const getCurrentStudyId = () => storage.getCurrentStudyId()
export const setCurrentStudyId = (id: string) => storage.setCurrentStudyId(id)
export const getStudyConfig = () => storage.getStudyConfig()
export const setStudyConfig = (config: StudyConfig) => storage.setStudyConfig(config)
export const getSession = (sessionId: string) => storage.getSession(sessionId)
export const saveSession = (session: Session) => storage.saveSession(session)
export const getAllSessions = () => storage.getAllSessions()
export const getTrial = (trialId: string) => storage.getTrial(trialId)
export const saveTrial = (trial: Trial) => storage.saveTrial(trial)
export const getTrialsBySession = (sessionId: string) => storage.getTrialsBySession(sessionId)
export const getUnsyncedTrials = () => storage.getUnsyncedTrials()
export const markTrialAsSynced = (trialId: string) => storage.markTrialAsSynced(trialId)
export const getAppState = () => storage.getAppState()
export const setAppState = (state: AppState) => storage.setAppState(state)
export const clearAll = () => storage.clearAll()
