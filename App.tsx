import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ErrorBoundary } from './src/components/common/ErrorBoundary'
import { MobileContainer } from './src/components/common/MobileContainer'
import { DrawerProvider } from './src/contexts/DrawerContext'
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
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ErrorBoundary>
          <DrawerProvider>
            <MobileContainer>
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Initializing...</Text>
              </View>
            </MobileContainer>
          </DrawerProvider>
          </ErrorBoundary>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary>
          <DrawerProvider>
            <StatusBar style="auto" />
            <MobileContainer>
              <AppNavigator />
            </MobileContainer>
          </DrawerProvider>
        </ErrorBoundary>
      </GestureHandlerRootView>
    </SafeAreaProvider>
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
