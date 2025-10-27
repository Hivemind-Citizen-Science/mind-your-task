import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { HaloTravelProps } from './types'
import { Halo } from './components/Halo'
import { useHaloAnimation } from './hooks/useHaloAnimation'
import { styles } from './styles'

export const HaloTravel: React.FC<HaloTravelProps> = ({
  correctAnswer,
  haloSize,
  travelSpeed,
  distanceDifference,
  haloColor,
  duration,
  onStimulusComplete
}) => {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Start animation immediately when component mounts
    setIsActive(true)

    // Animation will be controlled by the useHaloAnimation hook
    // No need for fixed timeout since completion is handled by phase transitions
  }, [])

  // Get animated halos
  const { phase, haloA, haloB } = useHaloAnimation({
    correctAnswer,
    haloSize,
    travelSpeed,
    distanceDifference,
    duration,
    isActive
  })

  // Call onStimulusComplete when both halos have finished traveling
  useEffect(() => {
    if (phase === 'complete' && onStimulusComplete) {
      onStimulusComplete()
    }
  }, [phase, onStimulusComplete])

  const deviceHeight = Dimensions.get('window').height
  const topMargin = deviceHeight * 0.05 + 60 // Below trial counter + some extra space

  return (
    <View style={[styles.container, { paddingTop: topMargin }]}>
      <Text style={styles.instruction}>
        Watch the halos travel, then choose which traveled farther
      </Text>
      
      <View style={styles.haloContainer}>
        <Halo
          x={haloA.x}
          y={haloA.y}
          size={haloA.size}
          color={haloColor}
          label={haloA.label}
          phase={haloA.phase as 'A' | 'B' | 'complete'}
        />
        
        <Halo
          x={haloB.x}
          y={haloB.y}
          size={haloB.size}
          color={haloColor}
          label={haloB.label}
          phase={haloB.phase as 'A' | 'B' | 'complete'}
        />
      </View>
    </View>
  )
}
