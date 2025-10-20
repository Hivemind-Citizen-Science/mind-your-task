import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ErrorBoundary } from './src/components/common/ErrorBoundary'
import { MobileContainer } from './src/components/common/MobileContainer'
import { AppNavigator } from './src/navigation/AppNavigator'
import { initializeApp } from './src/utils/initializeApp'
import { colors, typography } from './src/theme'

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        await initializeApp()
        setIsInitialized(true)
      } catch (error) {
        console.error('App initialization failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [])

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary>
          <MobileContainer>
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Initializing...</Text>
            </View>
          </MobileContainer>
        </ErrorBoundary>
      </GestureHandlerRootView>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <StatusBar style="auto" />
        <MobileContainer>
          <AppNavigator />
        </MobileContainer>
      </ErrorBoundary>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    color: colors.textPrimary,
  },
})
