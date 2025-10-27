import React from 'react'
import { View, Text } from 'react-native'
import { HaloProps } from '../types'
import { styles } from '../styles'

export const Halo: React.FC<HaloProps> = ({
  x,
  y,
  size,
  color,
  label,
  phase
}) => {
  return (
    <View style={[
      styles.halo,
      {
        width: size,
        height: size,
        backgroundColor: color,
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        opacity: phase === 'A' || phase === 'B' ? 1 : 0,
        transform: [{ scale: phase === 'A' || phase === 'B' ? 1 : 0 }],
      }
    ]}>
      <Text style={styles.haloLabel}>{label}</Text>
    </View>
  )
}
