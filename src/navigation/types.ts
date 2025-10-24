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
  DotMotion: undefined
}
