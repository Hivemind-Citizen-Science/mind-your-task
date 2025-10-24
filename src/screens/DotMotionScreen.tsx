import React, { useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { colors, typography, spacing } from '../theme'
import { DotKinematogram } from '../components/stimuli/DotKinematogram/DotKinematogram'

type DotMotionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>

export const DotMotionScreen: React.FC = () => {
  const navigation = useNavigation<DotMotionScreenNavigationProp>()
  const { width: screenWidth } = Dimensions.get('window')

  // Random parameters for the DotKinematogram
  const [trialParams] = useState(() => {
    const coherenceLevels = [10, 20, 40, 60, 80]
    const directions: ('left' | 'right')[] = ['left', 'right']
    const apertureShapes: ('square' | 'circle')[] = ['square', 'circle']
    
    const apertureSize = screenWidth * 0.5 // Half of screen width
    console.log('Screen width:', screenWidth, 'Generated aperture size:', apertureSize)
    
    return {
      coherence: coherenceLevels[Math.floor(Math.random() * coherenceLevels.length)],
      direction: directions[Math.floor(Math.random() * directions.length)],
      apertureShape: apertureShapes[Math.floor(Math.random() * apertureShapes.length)],
      apertureSize: apertureSize,
      dotCount: 3 + Math.floor(Math.random() * 3), // 3-5
      duration: 1500 + Math.random() * 1000 // 1.5-2.5 seconds
    }
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Random Dot Motion Task</Text>
      </View>

      <View style={styles.stimulusContainer}>
        <DotKinematogram
          coherence={trialParams.coherence}
          direction={trialParams.direction}
          apertureShape={trialParams.apertureShape}
          apertureSize={trialParams.apertureSize}
          dotCount={trialParams.dotCount}
          duration={trialParams.duration}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing.md,
  },
  backButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    ...typography.heading2,
    color: colors.textPrimary,
    flex: 1,
  },
  stimulusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.stimulusBackground,
  },
})
