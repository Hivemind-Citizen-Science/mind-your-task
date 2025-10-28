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

export const generateCalibrationTrials = (choiceLabels: [string, string] = ['Left', 'Right'], stimulusDuration: number = 800): TrialConfig[] => {
  const trials: TrialConfig[] = []
  
  // Create 5 left and 5 right trials
  for (let i = 0; i < 5; i++) {
    trials.push({
      trial_id: generateTrialId(),
      trial_number: i * 2 + 1,
      task_type: 'calibration',
      correct_answer: choiceLabels[0],
      trial_parameters: { 
        direction: 'left',
        choice_labels: choiceLabels,
        stimulus_duration: stimulusDuration
      }
    })
    trials.push({
      trial_id: generateTrialId(),
      trial_number: i * 2 + 2,
      task_type: 'calibration',
      correct_answer: choiceLabels[1],
      trial_parameters: { 
        direction: 'right',
        choice_labels: choiceLabels,
        stimulus_duration: stimulusDuration
      }
    })
  }
  
  // Shuffle using Fisher-Yates
  return shuffleArray(trials)
}

export const generateCalibrationTrialsWithNumbers = (taskConfig?: TaskConfig): TrialConfig[] => {
  const choiceLabels = taskConfig?.parameters?.choice_labels || ['Left', 'Right']
  const stimulusDuration = taskConfig?.parameters?.stimulus_duration || 800
  const trials = generateCalibrationTrials(choiceLabels, stimulusDuration)
  
  // Reassign trial numbers after shuffling
  return trials.map((trial, index) => ({
    ...trial,
    trial_number: index + 1,
  }))
}
