// Storage-specific types for the storage layer
export interface StorageData {
  deviceId?: string
  threeWordPhrase?: string
  currentStudyId?: string
  studyConfig?: any
  appState?: any
  syncState?: any
  notificationState?: any
  sessions?: Record<string, any>
  trials?: Record<string, any>
}

export interface StorageError {
  message: string
  code: string
  originalError?: any
}

export type StorageOperation = 'get' | 'set' | 'delete' | 'clear'
