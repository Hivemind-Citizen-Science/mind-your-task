import { TrialConfig, TaskConfig } from '../../types'
import { generateTrialId } from '../uuid'

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const generateHaloTravelTrials = (
  taskConfig: TaskConfig
): TrialConfig[] => {
  const trials: TrialConfig[] = []
  const trialsPerBlock = taskConfig.trials_per_block || 20
  const haloSize = taskConfig.parameters?.halo_size || 60
  const travelSpeed = taskConfig.parameters?.travel_speed || 200
  const distanceDifference = taskConfig.parameters?.distance_difference || 50
  const haloColor = taskConfig.parameters?.halo_color || '#B0BEC5'
  
  // Generate balanced A/B trials (10 A, 10 B)
  const trialsPerAnswer = Math.floor(trialsPerBlock / 2)
  const remainingTrials = trialsPerBlock % 2
  
  let trialNumber = 1
  
  // Generate A trials (halo A travels farther)
  for (let i = 0; i < trialsPerAnswer + (remainingTrials > 0 ? 1 : 0); i++) {
    trials.push({
      trial_id: generateTrialId(),
      trial_number: trialNumber++,
      task_type: 'halo_travel',
      correct_answer: 'A',
      trial_parameters: {
        correct_answer: 'A',
        halo_size: haloSize,
        travel_speed: travelSpeed,
        distance_difference: distanceDifference,
        halo_color: haloColor
      }
    })
  }
  
  // Generate B trials (halo B travels farther)
  for (let i = 0; i < trialsPerAnswer; i++) {
    trials.push({
      trial_id: generateTrialId(),
      trial_number: trialNumber++,
      task_type: 'halo_travel',
      correct_answer: 'B',
      trial_parameters: {
        correct_answer: 'B',
        halo_size: haloSize,
        travel_speed: travelSpeed,
        distance_difference: distanceDifference,
        halo_color: haloColor
      }
    })
  }
  
  // Shuffle the final array to randomize order
  return shuffleArray(trials)
}

/**
 * Generate trials with different distance differences for difficulty variation
 */
export const generateHaloTravelTrialsWithDifficulty = (
  taskConfig: TaskConfig
): TrialConfig[] => {
  const trials: TrialConfig[] = []
  const trialsPerBlock = taskConfig.trials_per_block || 20
  const haloSize = taskConfig.parameters?.halo_size || 60
  const travelSpeed = taskConfig.parameters?.travel_speed || 200
  const haloColor = taskConfig.parameters?.halo_color || '#B0BEC5'
  
  // Different distance differences for difficulty levels
  const distanceDifferences = [30, 50, 70] // Easy, medium, hard
  const trialsPerDifficulty = Math.floor(trialsPerBlock / distanceDifferences.length)
  const remainingTrials = trialsPerBlock % distanceDifferences.length
  
  let trialNumber = 1
  
  distanceDifferences.forEach((distanceDifference, difficultyIndex) => {
    const trialsForThisDifficulty = trialsPerDifficulty + (difficultyIndex < remainingTrials ? 1 : 0)
    const trialsPerAnswer = Math.floor(trialsForThisDifficulty / 2)
    const remainingForDifficulty = trialsForThisDifficulty % 2
    
    // Generate A trials
    for (let i = 0; i < trialsPerAnswer + (remainingForDifficulty > 0 ? 1 : 0); i++) {
      trials.push({
        trial_id: generateTrialId(),
        trial_number: trialNumber++,
        task_type: 'halo_travel',
        correct_answer: 'A',
        trial_parameters: {
          correct_answer: 'A',
          halo_size: haloSize,
          travel_speed: travelSpeed,
          distance_difference: distanceDifference,
          halo_color: haloColor
        }
      })
    }
    
    // Generate B trials
    for (let i = 0; i < trialsPerAnswer; i++) {
      trials.push({
        trial_id: generateTrialId(),
        trial_number: trialNumber++,
        task_type: 'halo_travel',
        correct_answer: 'B',
        trial_parameters: {
          correct_answer: 'B',
          halo_size: haloSize,
          travel_speed: travelSpeed,
          distance_difference: distanceDifference,
          halo_color: haloColor
        }
      })
    }
  })
  
  // Shuffle the final array to randomize order
  return shuffleArray(trials)
}
