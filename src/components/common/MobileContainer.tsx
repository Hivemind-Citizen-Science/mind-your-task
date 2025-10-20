import React from 'react'
import { View, StyleSheet, Platform, Dimensions } from 'react-native'
import { colors } from '../../theme'

interface MobileContainerProps {
  children: React.ReactNode
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  // Only apply mobile container on web
  if (Platform.OS !== 'web') {
    return <>{children}</>
  }

  const screenWidth = Dimensions.get('window').width
  const screenHeight = Dimensions.get('window').height
  
  // Mobile dimensions (iPhone 14 Pro Max as reference)
  const mobileWidth = 430
  const mobileHeight = 932
  
  // Calculate if we need to center the container
  const shouldCenter = screenWidth > mobileWidth

  return (
    <View style={styles.webContainer}>
      <View style={[
        styles.mobileContainer,
        shouldCenter && styles.centered,
        { 
          width: Math.min(mobileWidth, screenWidth),
          height: Math.min(mobileHeight, screenHeight)
        }
      ]}>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    minWidth: '100vw',
  },
  mobileContainer: {
    backgroundColor: colors.background,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  centered: {
    // Additional centering styles if needed
  },
})
