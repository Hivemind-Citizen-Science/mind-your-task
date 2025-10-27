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
  duration
}) => {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Start animation immediately when component mounts
    setIsActive(true)

    // Stop animation after duration
    const stopTimer = setTimeout(() => {
      setIsActive(false)
    }, duration)

    return () => {
      clearTimeout(stopTimer)
    }
  }, [duration])

  // Get animated halos
  const { phase, haloA, haloB } = useHaloAnimation({
    correctAnswer,
    haloSize,
    travelSpeed,
    distanceDifference,
    duration,
    isActive
  })

  const deviceHeight = Dimensions.get('window').height

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        Watch the halos travel, then choose which traveled farther
      </Text>
      
      <View style={styles.haloContainer}>
        {phase === 'A' && (
          <Halo
            x={haloA.x}
            y={haloA.y}
            size={haloA.size}
            color={haloColor}
            label={haloA.label}
            phase={haloA.phase as 'A' | 'B' | 'complete'}
          />
        )}
        
        {phase === 'B' && (
          <Halo
            x={haloB.x}
            y={haloB.y}
            size={haloB.size}
            color={haloColor}
            label={haloB.label}
            phase={haloB.phase as 'A' | 'B' | 'complete'}
          />
        )}
      </View>
      
      <Text style={styles.phaseText}>
        Phase: {phase}
      </Text>
      {phase === 'A' && (
        <Text style={styles.phaseText}>
          Halo A: x={Math.round(haloA.x)}, y={Math.round(haloA.y)}
        </Text>
      )}
      {phase === 'B' && (
        <Text style={styles.phaseText}>
          Halo B: x={Math.round(haloB.x)}, y={Math.round(haloB.y)}
        </Text>
      )}
      <Text style={styles.phaseText}>
        Duration: {duration}ms
      </Text>
    </View>
  )
}
