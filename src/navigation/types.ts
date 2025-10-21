export type RootStackParamList = {
  Welcome: undefined
  Calibration: undefined
  Home: undefined
  Task: { taskType: 'calibration' | 'dot_kinematogram' | 'halo_travel' }
  SessionCompletion: { sessionId: string }
  ComponentLibrary: undefined
  SwipeInteraction: undefined
}
