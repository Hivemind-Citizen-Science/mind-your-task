import React, { useState, useEffect } from 'react'
import { Dimensions, View } from 'react-native'
import { DotKinematogramProps } from './types'
import { Aperture } from './components/Aperture'
import { Dot } from './components/Dot'
import { useDotAnimation } from './hooks/useDotAnimation'
import { styles } from './styles'
import { colors, spacing } from '@/theme'

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

    // Console log trial condition
    console.log('DotKinematogram Trial Condition:', {
      coherence: `${coherence}%`,
      direction,
      correctAnswer: direction, // Direction is the correct answer
      apertureShape,
      apertureSize,
      dotCount,
      duration: `${duration}ms`
    })

    // Stop animation after duration
    const stopTimer = setTimeout(() => {
      setIsActive(false)
    }, duration)

    return () => {
      clearTimeout(stopTimer)
    }
  }, [duration, coherence, direction, apertureShape, apertureSize, dotCount])

  // Get animated dots
  const dots = useDotAnimation({
    coherence,
    direction,
    dotCount,
    apertureSize,
    duration,
    isActive
  })
  const deviceHeight = Dimensions.get('window').height
  return (
    <View style={ {flex: 1,
      backgroundColor: colors.stimulusBackground,
      // justifyContent: 'center',
      alignItems: 'center',
      paddingTop: deviceHeight/8
      }}>
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

