export const SCREEN_DIMENSIONS = {
  START_ZONE_SIZE: 80,
  CHOICE_ZONE_SIZE: 120,
  COIN_SIZE: 40,
  TRAIL_WIDTH: 3,
}

export const TASK_TYPES = {
  CALIBRATION: 'calibration',
  DOT_KINEMATOGRAM: 'dot_kinematogram',
  HALO_TRAVEL: 'halo_travel',
} as const

export const TASK_NAMES = {
  calibration: 'Calibration',
  dot_kinematogram: 'Random Dot Motion',
  halo_travel: 'Halo Travel',
}

export const TASK_ESTIMATED_TIME = {
  calibration: 2,
  dot_kinematogram: 5,
  halo_travel: 5,
}

export const PERIOD_ICONS = {
  sun: '☀️',
  sunset: '🌅',
  moon: '🌙',
  night: '🌃',
}

export const API_ENDPOINTS = {
  REGISTER_DEVICE: '/device/register',
  CREATE_STUDY: '/study/create',
  SYNC_TRIALS: '/trial/sync',
  REGISTER_PUSH_TOKEN: '/notification/register',
}

export const STORAGE_KEYS = {
  DEVICE_ID: 'device_id',
  THREE_WORD_PHRASE: 'three_word_phrase',
  CURRENT_STUDY_ID: 'current_study_id',
  STUDY_CONFIG: 'study_config',
  APP_STATE: 'app_state',
  SYNC_STATE: 'sync_state',
  NOTIFICATION_STATE: 'notification_state',
}
