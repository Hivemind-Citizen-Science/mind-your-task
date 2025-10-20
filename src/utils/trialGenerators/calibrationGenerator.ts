import { TrialConfig } from '../../types'
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

export const generateCalibrationTrials = (): TrialConfig[] => {
  const trials: TrialConfig[] = []
  
  // Create 5 left and 5 right trials
  for (let i = 0; i < 5; i++) {
    trials.push({
      trial_id: generateTrialId(),
      trial_number: i * 2 + 1,
      task_type: 'calibration',
      correct_answer: 'left',
      trial_parameters: { direction: 'left' }
    })
    trials.push({
      trial_id: generateTrialId(),
      trial_number: i * 2 + 2,
      task_type: 'calibration',
      correct_answer: 'right',
      trial_parameters: { direction: 'right' }
    })
  }
  
  // Shuffle using Fisher-Yates
  return shuffleArray(trials)
}

export const generateCalibrationTrialsWithNumbers = (): TrialConfig[] => {
  const trials = generateCalibrationTrials()
  
  // Reassign trial numbers after shuffling
  return trials.map((trial, index) => ({
    ...trial,
    trial_number: index + 1,
  }))
}
