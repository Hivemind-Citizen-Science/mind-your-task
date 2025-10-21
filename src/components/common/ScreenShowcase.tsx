import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { colors, typography, spacing } from '../../theme'
import { SessionCompletionScreen } from '../../screens/SessionCompletionScreen'
import { TaskScreen } from '../../screens/TaskScreen'
import { WelcomeScreen } from '../../screens/WelcomeScreen'
import { CalibrationScreen } from '../../screens/CalibrationScreen'
import { HomeScreen } from '../../screens/HomeScreen'
import { ComponentLibraryScreen } from '../../screens/ComponentLibraryScreen'
import { SwipeInteractionScreen } from '../../screens/SwipeInteractionScreen'
import { Session, Trial } from '../../types'

const Stack = createNativeStackNavigator()

// Mock data generators
const generateMockSession = (): Session => ({
  session_id: 'mock-session-123',
  user_id: 'mock-user',
  task_type: 'dot_kinematogram',
  started_at: Date.now() - 300000, // 5 minutes ago
  completed_at: Date.now(),
  status: 'completed',
  total_trials: 20,
  completed_trials: 20,
  correct_trials: 16,
  accuracy: 80,
  avg_response_time: 1200,
  device_info: {
    platform: 'iOS',
    version: '17.0',
    model: 'iPhone 15 Pro'
  },
  study_config: {
    study_id: 'mock-study',
    version: '1.0.0',
    created_at: Date.now() - 86400000
  }
})

const generateMockTrials = (sessionId: string): Trial[] => {
  const trials: Trial[] = []
  for (let i = 0; i < 20; i++) {
    trials.push({
      trial_id: `trial-${i + 1}`,
      session_id: sessionId,
      user_id: 'mock-user',
      trial_index: i,
      trial_type: 'dot_kinematogram',
      trial_parameters: {
        coherence: 0.5,
        direction: Math.random() > 0.5 ? 'left' : 'right',
        aperture_shape: 'circle',
        aperture_size: 5,
        dot_count: 100,
        stimulus_duration: 2000
      },
      user_response: Math.random() > 0.5 ? 'left' : 'right',
      is_correct: Math.random() > 0.2, // 80% accuracy
      response_time_ms: Math.floor(Math.random() * 2000) + 500,
      trajectory_data: [],
      timestamp: Date.now() - (20 - i) * 10000,
      synced: true,
      no_response: false
    })
  }
  return trials
}

// Mock navigation and route props
const createMockNavigation = () => ({
  navigate: (screen: string, params?: any) => {
    console.log(`Mock navigation to ${screen}`, params)
  },
  goBack: () => {
    console.log('Mock go back')
  },
  canGoBack: () => true,
  reset: () => {},
  setParams: () => {},
  dispatch: () => {},
  isFocused: () => true,
  addListener: () => () => {},
  removeListener: () => {},
  getParent: () => undefined,
  getState: () => ({} as any),
  setOptions: () => {},
  getId: () => 'mock-navigator'
})

const createMockRoute = (params: any) => ({
  key: 'mock-route',
  name: 'mock-screen',
  params,
  path: undefined
})

// Screen showcase components
export const SessionCompletionScreenShowcase: React.FC = () => {
  const mockSession = generateMockSession()
  const mockTrials = generateMockTrials(mockSession.session_id)
  
  // Mock the storage functions
  const originalGetSessionById = require('../../utils/sessionManager').getSessionById
  const originalGetTrialsBySession = require('../../utils/storage').getTrialsBySession
  const originalGetSyncStatus = require('../../utils/trialSyncManager').getSyncStatus
  
  // Temporarily override the functions
  require('../../utils/sessionManager').getSessionById = () => mockSession
  require('../../utils/storage').getTrialsBySession = () => mockTrials
  require('../../utils/trialSyncManager').getSyncStatus = () => ({
    isOnline: true,
    pendingTrials: 0,
    lastSyncAttempt: Date.now()
  })

  return (
    <View style={styles.showcaseContainer}>
      <Text style={styles.showcaseLabel}>Session Completion Screen</Text>
      <View style={styles.screenWrapper}>
        <NavigationIndependentTree>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen 
                name="SessionCompletion" 
                component={SessionCompletionScreen}
                initialParams={{ sessionId: mockSession.session_id }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NavigationIndependentTree>
      </View>
    </View>
  )
}

export const TaskScreenShowcase: React.FC = () => {
  // Mock the storage functions for TaskScreen
  const mockStudyConfig = {
    study_id: 'mock-study',
    version: '1.0.0',
    created_at: Date.now() - 86400000,
    task_configs: {
      dot_kinematogram: {
        enabled: true,
        trials_per_session: 20,
        coherence_levels: [0.1, 0.2, 0.3, 0.4, 0.5],
        directions: ['left', 'right'],
        aperture_shapes: ['circle', 'square'],
        aperture_sizes: [3, 5, 7],
        dot_counts: [50, 100, 150],
        stimulus_durations: [1000, 1500, 2000]
      }
    }
  }

  // Temporarily override the functions
  require('../../utils/storage').getStudyConfig = () => mockStudyConfig
  require('../../utils/sessionManager').createSession = () => generateMockSession()
  require('../../utils/sessionManager').saveSessionData = () => {}
  require('../../utils/trialSyncManager').saveTrialAndQueue = () => {}

  return (
    <View style={styles.showcaseContainer}>
      <Text style={styles.showcaseLabel}>Task Screen (Dot Kinematogram)</Text>
      <View style={styles.screenWrapper}>
        <NavigationIndependentTree>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen 
                name="Task" 
                component={TaskScreen}
                initialParams={{ taskType: 'dot_kinematogram' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NavigationIndependentTree>
      </View>
    </View>
  )
}

export const WelcomeScreenShowcase: React.FC = () => {
  return (
    <View style={styles.showcaseContainer}>
      <Text style={styles.showcaseLabel}>Welcome Screen</Text>
      <View style={styles.screenWrapper}>
        <NavigationIndependentTree>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen 
                name="Welcome" 
                component={() => <WelcomeScreen onGetStarted={() => console.log('Mock get started')} />}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NavigationIndependentTree>
      </View>
    </View>
  )
}

export const CalibrationScreenShowcase: React.FC = () => {
  return (
    <View style={styles.showcaseContainer}>
      <Text style={styles.showcaseLabel}>Calibration Screen</Text>
      <View style={styles.screenWrapper}>
        <NavigationIndependentTree>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen 
                name="Calibration" 
                component={CalibrationScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NavigationIndependentTree>
      </View>
    </View>
  )
}

export const HomeScreenShowcase: React.FC = () => {
  return (
    <View style={styles.showcaseContainer}>
      <Text style={styles.showcaseLabel}>Home Screen</Text>
      <View style={styles.screenWrapper}>
        <NavigationIndependentTree>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen 
                name="Home" 
                component={HomeScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NavigationIndependentTree>
      </View>
    </View>
  )
}

export const ComponentLibraryScreenShowcase: React.FC = () => {
  return (
    <View style={styles.showcaseContainer}>
      <Text style={styles.showcaseLabel}>Component Library Screen</Text>
      <View style={styles.screenWrapper}>
        <NavigationIndependentTree>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen 
                name="ComponentLibrary" 
                component={ComponentLibraryScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NavigationIndependentTree>
      </View>
    </View>
  )
}

export const SwipeInteractionScreenShowcase: React.FC = () => {
  return (
    <View style={styles.showcaseContainer}>
      <Text style={styles.showcaseLabel}>Swipe Interaction Screen</Text>
      <View style={styles.screenWrapper}>
        <NavigationIndependentTree>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen 
                name="SwipeInteraction" 
                component={SwipeInteractionScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NavigationIndependentTree>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  showcaseContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  showcaseLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  screenWrapper: {
    height: 400, // Fixed height for showcase
    overflow: 'hidden',
  },
})