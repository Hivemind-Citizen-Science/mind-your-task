import { Session, Trial } from '../types'

// API Request/Response Types
export interface SessionSyncPayload {
  session: Session
  device_id: string
  study_id: string
}

export interface TrialSyncPayload {
  trials: Trial[]
  session_id: string
  device_id: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: number
  version: string
  database: 'connected' | 'disconnected'
}

// Error types
export interface ApiError {
  code: string
  message: string
  details?: any
}

// Sync queue types
export interface SyncQueue {
  trial_ids: string[]
  last_sync_attempt: number
  retry_count: number
  max_retries: number
}

export interface SyncStatus {
  is_online: boolean
  last_successful_sync: number | null
  pending_trials: number
  failed_syncs: number
}
