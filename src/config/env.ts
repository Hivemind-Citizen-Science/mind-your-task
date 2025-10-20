import Constants from 'expo-constants'

export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  RESEARCHER_PASSCODE: process.env.EXPO_PUBLIC_RESEARCHER_PASSCODE || '1234',
  IS_DEV: __DEV__,
}

export const getApiUrl = (endpoint: string): string => {
  return `${ENV.API_URL}${endpoint}`
}
