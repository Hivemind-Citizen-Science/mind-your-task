import { TrialConfig, TaskConfig } from '../../types'
import { generateCalibrationTrialsWithNumbers } from './calibrationGenerator'
import { generateDotKinematogramTrialsBalanced } from './dotKinematogramGenerator'
import { generateHaloTravelTrials } from './haloTravelGenerator'

/**
 * Generate trials for any task type
 */
export const generateTrialsForTask = (
  taskType: string,
  taskConfig: TaskConfig
): TrialConfig[] => {
  switch (taskType) {
    case 'calibration':
      return generateCalibrationTrialsWithNumbers()
    
    case 'dot_kinematogram':
      return generateDotKinematogramTrialsBalanced(taskConfig)
    
    case 'halo_travel':
      return generateHaloTravelTrials(taskConfig)
    
    default:
      console.error(`Unknown task type: ${taskType}`)
      return []
  }
}

/**
 * Get default trial count for a task type
 */
export const getDefaultTrialCount = (taskType: string): number => {
  switch (taskType) {
    case 'calibration':
      return 10
    case 'dot_kinematogram':
      return 20
    case 'halo_travel':
      return 20
    default:
      return 10
  }
}

/**
 * Validate trial configuration
 */
export const validateTrialConfig = (taskType: string, taskConfig: TaskConfig): boolean => {
  if (!taskConfig.enabled) {
    return false
  }
  
  if (taskConfig.trials_per_block < 1) {
    console.error(`Invalid trial count for ${taskType}: ${taskConfig.trials_per_block}`)
    return false
  }
  
  // Task-specific validation
  switch (taskType) {
    case 'dot_kinematogram':
      const coherenceLevels = taskConfig.parameters?.coherence_levels
      if (!coherenceLevels || !Array.isArray(coherenceLevels) || coherenceLevels.length === 0) {
        console.error('Invalid coherence levels for dot kinematogram')
        return false
      }
      break
    
    case 'halo_travel':
      const distanceDifference = taskConfig.parameters?.distance_difference
      if (typeof distanceDifference !== 'number' || distanceDifference <= 0) {
        console.error('Invalid distance difference for halo travel')
        return false
      }
      break
  }
  
  return true
}

// Re-export individual generators
export { generateCalibrationTrialsWithNumbers } from './calibrationGenerator'
export { generateDotKinematogramTrialsBalanced } from './dotKinematogramGenerator'
export { generateHaloTravelTrials } from './haloTravelGenerator'
