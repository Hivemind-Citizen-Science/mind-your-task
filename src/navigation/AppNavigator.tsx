import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { WelcomeScreen } from '../screens/WelcomeScreen'
import { CalibrationScreen } from '../screens/CalibrationScreen'
import { HomeScreen } from '../screens/HomeScreen'
import { TaskScreen } from '../screens/TaskScreen'
import { SessionCompletionScreen } from '../screens/SessionCompletionScreen'
import { ComponentLibraryScreen } from '../screens/ComponentLibraryScreen'
import { SwipeInteractionScreen } from '../screens/SwipeInteractionScreen'
import { ResultsDisplayScreen, SessionWithTrials } from '../screens/ResultsDisplayScreen'
import { GlobalDrawer } from '../components/common/GlobalDrawer'
import { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

// Wrapper component for ResultsDisplayScreen
const ResultsDisplayScreenWrapper: React.FC = () => {
  return <ResultsDisplayScreen />
}

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <GlobalDrawer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{ 
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Welcome">
            {({ navigation }) => (
              <WelcomeScreen onGetStarted={() => navigation.navigate('Calibration')} />
            )}
          </Stack.Screen>
          <Stack.Screen 
            name="Calibration" 
            component={CalibrationScreen}
            options={{
              gestureEnabled: false, // Prevent back gesture during calibration
            }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
          />
          <Stack.Screen 
            name="Task" 
            component={TaskScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen 
            name="SessionCompletion" 
            component={SessionCompletionScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen 
            name="ComponentLibrary" 
            component={ComponentLibraryScreen}
          />
          <Stack.Screen 
            name="SwipeInteraction" 
            component={SwipeInteractionScreen}
          />
          <Stack.Screen 
            name="ResultsDisplay" 
            component={ResultsDisplayScreenWrapper}
            options={{
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </GlobalDrawer>
    </NavigationContainer>
  )
}
