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

export const generateDotKinematogramTrials = (
  taskConfig: TaskConfig
): TrialConfig[] => {
  const trials: TrialConfig[] = []
  const trialsPerBlock = taskConfig.trials_per_block || 20
  const coherenceLevels = taskConfig.parameters?.coherence_levels || [10, 20, 40, 60]
  const apertureShape = taskConfig.parameters?.aperture_shape || 'square'
  const apertureSize = taskConfig.parameters?.aperture_size || 70
  const dotCount = taskConfig.parameters?.dot_count || 3
  const stimulusDuration = taskConfig.parameters?.stimulus_duration || 800
  
  // Calculate trials per coherence level
  const trialsPerCoherence = Math.floor(trialsPerBlock / coherenceLevels.length)
  const remainingTrials = trialsPerBlock % coherenceLevels.length
  
  let trialNumber = 1
  
  // Generate trials for each coherence level
  coherenceLevels.forEach((coherence: number, coherenceIndex: number) => {
    const trialsForThisCoherence = trialsPerCoherence + (coherenceIndex < remainingTrials ? 1 : 0)
    
    for (let i = 0; i < trialsForThisCoherence; i++) {
      // Alternate between left and right directions
      const direction = i % 2 === 0 ? 'left' : 'right'
      
      trials.push({
        trial_id: generateTrialId(),
        trial_number: trialNumber++,
        task_type: 'dot_kinematogram',
        correct_answer: direction,
        trial_parameters: {
          coherence,
          direction,
          aperture_shape: apertureShape,
          aperture_size: apertureSize,
          dot_count: dotCount,
          stimulus_duration: stimulusDuration
        }
      })
    }
  })
  
  // Shuffle the final array to randomize order
  return shuffleArray(trials)
}

/**
 * Generate trials with balanced left/right distribution per coherence level
 */
export const generateDotKinematogramTrialsBalanced = (
  taskConfig: TaskConfig
): TrialConfig[] => {
  const trials: TrialConfig[] = []
  const trialsPerBlock = taskConfig.trials_per_block || 20
  const coherenceLevels = taskConfig.parameters?.coherence_levels || [10, 20, 40, 60]
  const apertureShape = taskConfig.parameters?.aperture_shape || 'square'
  const apertureSize = taskConfig.parameters?.aperture_size || 70
  const dotCount = taskConfig.parameters?.dot_count || 3
  const stimulusDuration = taskConfig.parameters?.stimulus_duration || 800
  
  // Calculate trials per coherence level
  const trialsPerCoherence = Math.floor(trialsPerBlock / coherenceLevels.length)
  const remainingTrials = trialsPerBlock % coherenceLevels.length
  
  let trialNumber = 1
  
  // Generate trials for each coherence level
  coherenceLevels.forEach((coherence: number, coherenceIndex: number) => {
    const trialsForThisCoherence = trialsPerCoherence + (coherenceIndex < remainingTrials ? 1 : 0)
    const leftTrials = Math.ceil(trialsForThisCoherence / 2)
    const rightTrials = trialsForThisCoherence - leftTrials
    
    // Generate left trials
    for (let i = 0; i < leftTrials; i++) {
      trials.push({
        trial_id: generateTrialId(),
        trial_number: trialNumber++,
        task_type: 'dot_kinematogram',
        correct_answer: 'left',
        trial_parameters: {
          coherence,
          direction: 'left',
          aperture_shape: apertureShape,
          aperture_size: apertureSize,
          dot_count: dotCount,
          stimulus_duration: stimulusDuration
        }
      })
    }
    
    // Generate right trials
    for (let i = 0; i < rightTrials; i++) {
      trials.push({
        trial_id: generateTrialId(),
        trial_number: trialNumber++,
        task_type: 'dot_kinematogram',
        correct_answer: 'right',
        trial_parameters: {
          coherence,
          direction: 'right',
          aperture_shape: apertureShape,
          aperture_size: apertureSize,
          dot_count: dotCount,
          stimulus_duration: stimulusDuration
        }
      })
    }
  })
  
  // Shuffle the final array to randomize order
  return shuffleArray(trials)
}
