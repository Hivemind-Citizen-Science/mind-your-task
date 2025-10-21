import { apiClient, checkApiHealth } from './api'
import { SessionSyncPayload, TrialSyncPayload, ApiResponse, HealthResponse } from './types'

/**
 * Submit session metadata to the backend
 */
export const postSession = async (payload: SessionSyncPayload): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse>('/api/sessions', payload)
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Session sync failed')
    }
    
    console.log('Session synced successfully:', payload.session.session_id)
  } catch (error) {
    console.error('Failed to sync session:', error)
    throw error
  }
}

/**
 * Submit trial batch data to the backend
 */
export const postTrials = async (payload: TrialSyncPayload): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse>('/api/trials', payload)
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Trial sync failed')
    }
    
    console.log(`Trials synced successfully: ${payload.trials.length} trials for session ${payload.session_id}`)
  } catch (error) {
    console.error('Failed to sync trials:', error)
    throw error
  }
}

/**
 * Check backend connectivity and health
 */
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get<HealthResponse>('/api/health')
    return response.data.status === 'healthy' && response.data.database === 'connected'
  } catch (error) {
    console.log('Health check failed:', error)
    return false
  }
}

/**
 * Get sync status from backend (optional feature)
 */
export const getSyncStatus = async (deviceId: string): Promise<{ lastSync: number; pendingCount: number } | null> => {
  try {
    const response = await apiClient.get<ApiResponse<{ lastSync: number; pendingCount: number }>>(`/api/sync-status/${deviceId}`)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    return null
  } catch (error) {
    console.log('Failed to get sync status:', error)
    return null
  }
}

/**
 * Force sync all pending data
 */
export const forceSyncAll = async (deviceId: string): Promise<{ syncedSessions: number; syncedTrials: number }> => {
  try {
    const response = await apiClient.post<ApiResponse<{ syncedSessions: number; syncedTrials: number }>>('/api/force-sync', { deviceId })
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error('Force sync failed')
  } catch (error) {
    console.error('Force sync failed:', error)
    throw error
  }
}
