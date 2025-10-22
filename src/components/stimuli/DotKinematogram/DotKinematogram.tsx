import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { DotKinematogramProps } from './types'
import { Aperture } from './components/Aperture'
import { Dot } from './components/Dot'
import { useDotAnimation } from './hooks/useDotAnimation'
import { styles } from './styles'

export const DotKinematogram: React.FC<DotKinematogramProps> = ({
  coherence,
  direction,
  apertureShape,
  apertureSize,
  dotCount,
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

  // Get animated dots
  const dots = useDotAnimation({
    coherence,
    direction,
    dotCount,
    apertureSize,
    duration,
    isActive
  })

  return (
    <View style={styles.container}>
      <Aperture size={apertureSize} shape={apertureShape}>
        {dots.map((dot) => (
          <Dot
            key={dot.id}
            x={dot.x}
            y={dot.y}
          />
        ))}
      </Aperture>
    </View>
  )
}

