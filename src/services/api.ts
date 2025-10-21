import axios, { AxiosInstance, AxiosError } from 'axios'
import { Platform } from 'react-native'

// Get API URL from environment or use default
const getApiUrl = (): string => {
  // In production, this would come from EXPO_PUBLIC_API_URL
  const envUrl = process.env.EXPO_PUBLIC_API_URL
  if (envUrl) {
    return envUrl
  }
  
  // Default development URLs
  if (Platform.OS === 'web') {
    return 'http://localhost:3001'
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:3001'
  } else {
    return 'http://10.0.2.2:3001' // Android emulator
  }
}

// Create axios instance with default configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: getApiUrl(),
    timeout: 10000, // 10 second timeout
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })

  // Request interceptor for logging
  client.interceptors.request.use(
    (config) => {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
      return config
    },
    (error) => {
      console.error('API Request Error:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => {
      console.log(`API Response: ${response.status} ${response.config.url}`)
      return response
    },
    (error: AxiosError) => {
      console.error('API Response Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
      })
      
      // Don't throw network errors - let the app continue working
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        console.log('Network unavailable, data will be queued for later sync')
        return Promise.resolve({ data: null, status: 'offline' })
      }
      
      return Promise.reject(error)
    }
  )

  return client
}

// Export the configured client
export const apiClient = createApiClient()

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/api/health')
    return response.status === 200
  } catch (error) {
    console.log('API health check failed:', error)
    return false
  }
}
