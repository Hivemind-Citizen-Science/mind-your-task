import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated'
import { useSwipeGesture } from './hooks/useSwipeGesture'
import { useTrajectoryRecording } from './hooks/useTrajectoryRecording'
import { StartZone } from './components/StartZone'
import { ChoiceZone } from './components/ChoiceZone'
import { Coin } from './components/Coin'
import { Trail } from './components/Trail'
import { SwipeInteractionProps, SwipeResult } from './types'
import { colors } from '../../theme'

// Use container dimensions instead of screen dimensions for web
const getContainerDimensions = () => {
  if (Platform.OS === 'web') {
    // On web, use mobile container dimensions
    const mobileWidth = 430
    const mobileHeight = 932
    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height
    
    return {
      width: Math.min(mobileWidth, screenWidth),
      height: Math.min(mobileHeight, screenHeight)
    }
  }
  
  // On mobile, use full screen dimensions
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window')
  return { width: screenWidth, height: screenHeight }
}

const { width: baseScreenWidth, height: baseScreenHeight } = getContainerDimensions()

const SCREEN_DIMENSIONS = {
  START_ZONE_SIZE: 80,
  CHOICE_ZONE_SIZE: 120,
  COIN_SIZE: 40,
}

export const SwipeInteraction: React.FC<SwipeInteractionProps> = ({
  onSwipeComplete,
  leftLabel,
  rightLabel,
  disabled = false,
}) => {
  const insets = useSafeAreaInsets()
  const [isActive, setIsActive] = useState(false)
  const [trajectory, setTrajectory] = useState<Array<{ x: number; y: number; timestamp: number }>>([])

  // Calculate positions according to spec with responsive layout
  const screenWidth = baseScreenWidth - (insets.left + insets.right)
  const screenHeight = baseScreenHeight - (insets.top + insets.bottom)
  const startZoneY = screenHeight - (screenHeight * 0.15) // 10% from bottom edge within safe area
  const startZoneX = screenWidth / 2
  // Move response zones closer to edges (justified alignment)
  const edgeMargin = screenWidth * 0.05 // 5% from edges instead of fixed 60px
  const leftChoiceX = edgeMargin + SCREEN_DIMENSIONS.CHOICE_ZONE_SIZE / 2
  const rightChoiceX = screenWidth - edgeMargin - SCREEN_DIMENSIONS.CHOICE_ZONE_SIZE / 2
  // Move choice zones lower to avoid overlap with trial counter
  const choiceY = screenHeight * 0.15 // 15% from top edge instead of fixed 100px

  const {
    coinPosition,
    isActive: gestureActive,
    gestureHandler,
    resetState,
    trajectory: gestureTrajectory,
  } = useSwipeGesture({
    onSwipeComplete: (result: SwipeResult) => {
      onSwipeComplete(result)
      setIsActive(false)
      setTrajectory([])
    },
    onTrailStart: () => {
      setTrajectory([])
    },
    startZoneY,
    choiceZoneSize: SCREEN_DIMENSIONS.CHOICE_ZONE_SIZE,
    screenWidth,
    screenHeight,
  })

  // Handle gesture state changes
  useEffect(() => {
    if (gestureActive.value && !isActive) {
      setIsActive(true)
      // Don't reset trajectory here - let it build up
    } else if (!gestureActive.value && isActive) {
      setIsActive(false)
    }
  }, [gestureActive.value, isActive])

  // Sync trajectory from gesture handler
  useAnimatedReaction(
    () => gestureTrajectory.value,
    (currentTrajectory) => {
      console.log('Trajectory reaction triggered:', {
        isActive,
        trajectoryLength: currentTrajectory?.length || 0,
        hasTrajectory: !!currentTrajectory
      })
      if (isActive && currentTrajectory && currentTrajectory.length > 0) {
        console.log('Syncing trajectory:', currentTrajectory.length, 'points')
        runOnJS(setTrajectory)(currentTrajectory)
      }
    },
    [isActive]
  )

  const handleReset = () => {
    resetState()
    setIsActive(false)
    setTrajectory([])
  }

  if (disabled) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.disabledOverlay} />
        <StartZone
          x={startZoneX}
          y={startZoneY}
          size={SCREEN_DIMENSIONS.START_ZONE_SIZE}
          isActive={false}
        />
        <ChoiceZone
          x={leftChoiceX}
          y={choiceY}
          size={SCREEN_DIMENSIONS.CHOICE_ZONE_SIZE}
          label={leftLabel}
          isActive={false}
        />
        <ChoiceZone
          x={rightChoiceX}
          y={choiceY}
          size={SCREEN_DIMENSIONS.CHOICE_ZONE_SIZE}
          label={rightLabel}
          isActive={false}
        />
      </SafeAreaView>
    )
  }

  // Debug logging
  console.log('SwipeInteraction render:', {
    startZoneX,
    startZoneY,
    leftChoiceX,
    rightChoiceX,
    choiceY,
    screenWidth,
    screenHeight
  })

  return (
    <SafeAreaView style={styles.container}>
      <GestureDetector gesture={gestureHandler}>
        <View style={styles.gestureArea}>
          {/* Start Zone */}
          <StartZone
            x={startZoneX}
            y={startZoneY}
            size={SCREEN_DIMENSIONS.START_ZONE_SIZE}
            isActive={isActive}
          />

          {/* Choice Zones */}
          <ChoiceZone
            x={leftChoiceX}
            y={choiceY}
            size={SCREEN_DIMENSIONS.CHOICE_ZONE_SIZE}
            label={leftLabel}
            isActive={isActive}
          />
          <ChoiceZone
            x={rightChoiceX}
            y={choiceY}
            size={SCREEN_DIMENSIONS.CHOICE_ZONE_SIZE}
            label={rightLabel}
            isActive={isActive}
          />

          {/* Trail */}
          <Trail
            trajectory={trajectory}
            isVisible={isActive && trajectory.length > 0}
            strokeWidth={SCREEN_DIMENSIONS.COIN_SIZE}
          />
          

          {/* Coin */}
          <Coin
            position={coinPosition}
            isActive={isActive}
            size={SCREEN_DIMENSIONS.COIN_SIZE}
          />
        </View>
      </GestureDetector>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Match app theme background
  },
  gestureArea: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
  debugInfo: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
  },
})
