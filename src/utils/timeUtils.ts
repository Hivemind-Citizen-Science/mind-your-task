import { TimePeriod, StudyConfig } from '../types'

export const getCurrentPeriod = (config: StudyConfig): TimePeriod | null => {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  for (const period of config.time_periods) {
    const [startHour, startMin] = period.start_time.split(':').map(Number)
    const [endHour, endMin] = period.end_time.split(':').map(Number)
    
    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin
    
    if (currentTime >= startTime && currentTime <= endTime) {
      return period
    }
  }
  
  return null
}

export const getTimeRemainingInPeriod = (period: TimePeriod): number => {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  
  const [endHour, endMin] = period.end_time.split(':').map(Number)
  const endMinutes = endHour * 60 + endMin
  
  return Math.max(0, endMinutes - currentMinutes)
}

export const formatTimeRemaining = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export const isGracePeriodElapsed = (
  lastSessionTime: number,
  graceHours: number
): boolean => {
  const now = Date.now()
  const graceMs = graceHours * 60 * 60 * 1000
  return (now - lastSessionTime) >= graceMs
}

export const getDayNumber = (startDate: string): number => {
  const start = new Date(startDate)
  const now = new Date()
  const diffTime = now.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays)
}

export const isStudyComplete = (
  startDate: string,
  durationDays: number
): boolean => {
  return getDayNumber(startDate) > durationDays
}
