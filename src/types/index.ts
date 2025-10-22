// ==================== STUDY STRUCTURE ====================

export interface StudyConfig {
  study_id: string
  study_name: string
  duration_days: number
  time_periods: TimePeriod[]
  grace_period_hours: number
  active_tasks: string[]
  task_configs: Record<string, TaskConfig>
  trial_settings: TrialSettings
  notification_settings: NotificationSettings
  ui_preferences: UIPreferences
  created_at: number
}

export interface TimePeriod {
  id: string
  name: string
  start_time: string  // "HH:MM"
  end_time: string    // "HH:MM"
  icon: 'sun' | 'moon' | 'sunset' | 'night'
}

export interface TaskConfig {
  enabled: boolean
  trials_per_block: number
  parameters: Record<string, any>
}

export interface TrialSettings {
  timeout_seconds: number
  show_trial_counter: boolean
  delay_range_ms: [number, number]
  rest_period_ms: number
  feedback_duration_ms: number
}

export interface NotificationSettings {
  daily_reminder_time: string
  inactivity_threshold_days: number
}

export interface UIPreferences {
  primary_color: string
  background_color: string
  stimulus_area_bg: string
}

// ==================== SESSION & TRIAL ====================

export interface Session {
  session_id: string
  study_id: string
  device_id: string
  task_type: string
  period_type: string
  session_date: string
  started_at: number
  completed_at: number | null
  completed: boolean
  is_practice: boolean
  is_post_study: boolean
  trial_ids: string[]
}

export interface Trial {
  trial_id: string
  session_id: string
  task_type: string
  trial_number: number
  trial_parameters: Record<string, any>
  user_response: string
  correct_answer: string
  is_correct: boolean
  response_time_ms: number
  trajectory_data: TrajectoryPoint[]
  feedback_shown: 'red' | 'green'
  no_response: boolean
  timestamp: number
  synced: boolean
}

export interface TrajectoryPoint {
  x: number
  y: number
  timestamp: number
}

// ==================== TRIAL CONFIGURATION ====================

export interface TrialConfig {
  trial_id: string
  trial_number: number
  task_type: string
  correct_answer: string
  trial_parameters: Record<string, any>
}

export interface TrialResult {
  trial_id: string
  user_response: string
  is_correct: boolean
  response_time_ms: number
  trajectory_data: TrajectoryPoint[]
  timestamp: number
  no_response: boolean
}

// ==================== APP STATE ====================

export interface AppState {
  onboarding_completed: boolean
  tasks_practiced: string[]
  study_start_date: string
  timezone_on_registration: string
  last_active: number
}

export interface SyncState {
  trial_ids: string[]
  last_sync_attempt: number
  retry_count: number
}

export interface NotificationState {
  push_token: string | null
  permission_granted: boolean
  last_reminder_sent: number
  scheduled_notifications: string[]
}

// ==================== NAVIGATION ====================

export type RootStackParamList = {
  Welcome: undefined
  Consent: undefined
  Registration: undefined
  Calibration: undefined
  Home: undefined
  Task: { taskType: 'calibration' | 'dot_kinematogram' | 'halo_travel' }
  SessionCompletion: { sessionId?: string }
  TaskInstructions: { taskType: string }
  Practice: { taskType: string }
  SecretSettings: undefined
  ComponentLibrary: undefined
  SwipeInteraction: undefined
  ResultsDisplay: undefined
}

// ==================== SWIPE INTERACTION ====================

export interface SwipeResult {
  choice: 'left' | 'right' | 'A' | 'B'
  trajectoryData: TrajectoryPoint[]
  responseTimeMs: number
}
