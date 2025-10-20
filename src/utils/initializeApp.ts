import { generateUUID } from './uuid'
import { DEFAULT_CONFIG } from '../config/defaultConfig'
import { 
  getDeviceId, 
  setDeviceId, 
  getStudyConfig, 
  setStudyConfig, 
  getCurrentStudyId, 
  setCurrentStudyId, 
  getAppState, 
  setAppState 
} from './storage'

export const initializeApp = async (): Promise<void> => {
  try {
    // Check if already initialized
    const existingDeviceId = getDeviceId()
    if (existingDeviceId) {
      console.log('App already initialized')
      return
    }

    console.log('Initializing app for first time...')

    // Generate device ID
    const newDeviceId = generateUUID()
    setDeviceId(newDeviceId)
    console.log('Device ID generated:', newDeviceId)

    // Initialize study config with defaults
    setStudyConfig(DEFAULT_CONFIG)
    setCurrentStudyId(DEFAULT_CONFIG.study_id)
    console.log('Study config initialized:', DEFAULT_CONFIG.study_id)

    // Initialize app state
    const appState = {
      onboarding_completed: false,
      tasks_practiced: [],
      study_start_date: new Date().toISOString().split('T')[0],
      timezone_on_registration: Intl.DateTimeFormat().resolvedOptions().timeZone,
      last_active: Date.now()
    }
    setAppState(appState)
    console.log('App state initialized:', appState)

    console.log('App initialization complete')
  } catch (error) {
    console.error('Failed to initialize app:', error)
    throw error
  }
}

export const checkInitialization = (): boolean => {
  const deviceId = getDeviceId()
  const studyConfig = getStudyConfig()
  const appState = getAppState()
  
  return !!(deviceId && studyConfig && appState)
}
