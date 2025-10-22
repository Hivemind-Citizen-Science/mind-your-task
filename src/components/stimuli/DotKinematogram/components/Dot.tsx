import React from 'react'
import { View } from 'react-native'
import { DotProps } from '../types'
import { styles } from '../styles'

export const Dot: React.FC<DotProps> = ({ x, y, size = 4 }) => {
  return (
    <View style={[
      styles.dot,
      {
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
      }
    ]} />
  )
}
