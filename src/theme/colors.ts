export const colors = {
  // Primary - Warm dark blue palette
  primary: '#4A90E2',        // Warm blue
  primaryDark: '#2C5AA0',    // Deep warm blue
  primaryLight: '#7BB3F0',   // Light warm blue
  primaryLighter: '#A8C8F0', // Very light warm blue
  
  // Accent - High contrast for feedback
  success: '#4CAF50',        // Warm green
  error: '#F44336',          // Warm red
  warning: '#FF9800',        // Warm orange
  
  // Neutral - Dark theme with warm undertones
  background: '#1A2332',     // Warm dark blue-gray
  surface: '#2A3441',        // Slightly lighter warm blue-gray
  surfaceElevated: '#3A4451', // Elevated surface
  textPrimary: '#E8F4FD',   // Very light warm blue
  textSecondary: '#B8C5D1', // Medium warm blue-gray
  textTertiary: '#8A9BA8',  // Darker warm blue-gray
  border: '#4A5568',        // Medium warm blue-gray
  borderLight: '#3A4451',   // Darker warm blue-gray
  
  // Stimulus - High contrast for research
  stimulusBackground: '#0F1419',  // Very dark warm blue
  stimulusElement: '#FFFFFF',    // Pure white for max contrast
  stimulusAccent: '#4A90E2',     // Warm blue accent
  halo: '#8A9BA8',              // Warm blue-gray for subtle elements
  
  // Interactive - Swipe components
  coin: '#4A90E2',              // Warm blue
  coinActive: '#2C5AA0',        // Darker when active
  trail: 'rgba(74, 144, 226, 0.4)', // Semi-transparent warm blue
  startZone: '#4A90E2',         // Warm blue
  startZoneActive: '#2C5AA0',    // Darker when active
  choiceZone: '#2A3441',        // Dark surface
  choiceZoneActive: '#3A4451',  // Elevated surface when active
  choiceZoneBorder: '#4A90E2',  // Warm blue border
  
  // Feedback - High contrast
  feedbackCorrect: '#4CAF50',    // Warm green
  feedbackIncorrect: '#F44336', // Warm red
  feedbackBackground: 'rgba(15, 20, 25, 0.9)', // Very dark warm overlay
  
  // UI Elements
  buttonPrimary: '#4A90E2',
  buttonPrimaryPressed: '#2C5AA0',
  buttonSecondary: '#2A3441',
  buttonSecondaryPressed: '#3A4451',
  
  // Status
  online: '#4CAF50',
  offline: '#F44336',
  syncing: '#FF9800',
} as const
