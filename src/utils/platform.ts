import { Platform } from 'react-native'

export const isWeb = Platform.OS === 'web'
export const isIOS = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'
export const isMobile = isIOS || isAndroid

export const getDevicePlatform = (): 'ios' | 'android' | 'web' => {
  if (isWeb) return 'web'
  if (isIOS) return 'ios'
  return 'android'
}
