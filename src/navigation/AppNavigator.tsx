import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { WelcomeScreen } from '../screens/WelcomeScreen'
import { CalibrationScreen } from '../screens/CalibrationScreen'
import { HomeScreen } from '../screens/HomeScreen'
import { ComponentLibraryScreen } from '../screens/ComponentLibraryScreen'
import { SwipeInteractionScreen } from '../screens/SwipeInteractionScreen'
import { GlobalDrawer } from '../components/common/GlobalDrawer'
import { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <GlobalDrawer>
        <Stack.Navigator 
          initialRouteName="Welcome"
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
            name="ComponentLibrary" 
            component={ComponentLibraryScreen}
          />
          <Stack.Screen 
            name="SwipeInteraction" 
            component={SwipeInteractionScreen}
          />
        </Stack.Navigator>
      </GlobalDrawer>
    </NavigationContainer>
  )
}
