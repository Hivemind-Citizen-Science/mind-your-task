import * as Crypto from 'expo-crypto'

export const generateUUID = (): string => {
  return Crypto.randomUUID()
}

export const generateStudyId = (): string => {
  return `study_${Date.now()}_${generateUUID().slice(0, 8)}`
}

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${generateUUID().slice(0, 8)}`
}

export const generateTrialId = (): string => {
  return `trial_${Date.now()}_${generateUUID().slice(0, 8)}`
}
