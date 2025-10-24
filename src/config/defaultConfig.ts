import { StudyConfig } from '../types'
import { generateStudyId } from '../utils/uuid'

export const DEFAULT_CONFIG: StudyConfig = {
  study_id: generateStudyId(),
  study_name: 'Perceptual Decision Making',
  duration_days: 20,
  time_periods: [
    {
      id: 'morning',
      name: 'Morning',
      start_time: '06:00',
      end_time: '10:00',
      icon: 'sun',
    },
    {
      id: 'afternoon',
      name: 'Afternoon',
      start_time: '11:00',
      end_time: '15:00',
      icon: 'sunset',
    },
    {
      id: 'evening',
      name: 'Evening',
      start_time: '18:00',
      end_time: '22:00',
      icon: 'moon',
    },
  ],
  grace_period_hours: 2,
  active_tasks: ['calibration', 'dot_kinematogram', 'halo_travel'],
  task_configs: {
    calibration: {
      enabled: true,
      trials_per_block: 10,
      parameters: {},
    },
    dot_kinematogram: {
      enabled: true,
      trials_per_block: 20,
      parameters: {
        coherence_levels: [10, 20, 40, 60],
        aperture_shape: 'square',
        aperture_size: 120,
        dot_count: 3,
        stimulus_duration: 800,
      },
    },
    halo_travel: {
      enabled: true,
      trials_per_block: 20,
      parameters: {
        halo_size: 60,
        travel_speed: 200,
        distance_difference: 50,
        halo_color: '#B0BEC5',
      },
    },
  },
  trial_settings: {
    timeout_seconds: 5,
    show_trial_counter: true,
    delay_range_ms: [700, 1000],
    rest_period_ms: 300,
    feedback_duration_ms: 300,
  },
  notification_settings: {
    daily_reminder_time: '09:00',
    inactivity_threshold_days: 1,
  },
  ui_preferences: {
    primary_color: '#4A90E2',
    background_color: '#F5F7FA',
    stimulus_area_bg: '#2C2C2C',
  },
  created_at: Date.now(),
}
