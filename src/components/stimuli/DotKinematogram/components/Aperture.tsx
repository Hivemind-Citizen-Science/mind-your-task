import React from 'react'
import { View } from 'react-native'
import { ApertureProps } from '../types'
import { styles } from '../styles'

export const Aperture: React.FC<ApertureProps> = ({ size, shape, children }) => {
  return (
    <View style={[
      styles.aperture,
      {
        width: size,
        height: size,
        borderRadius: shape === 'circle' ? size / 2 : 0,
      }
    ]}>
      {children}
    </View>
  )
}
