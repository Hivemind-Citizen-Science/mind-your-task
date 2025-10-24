import React from 'react'
import { View } from 'react-native'
import { ApertureProps } from '../types'
import { styles } from '../styles'

export const Aperture: React.FC<ApertureProps> = ({ size, shape, children }) => {
  // Debug log to verify aperture size
  console.log('Aperture size:', size, 'shape:', shape)
  
  return (
    <View style={[
      styles.aperture,
      {
        width: size,
        height: size,
        borderRadius: shape === 'circle' ? size / 2 : 0,
        backgroundColor: 'rgba(74, 144, 226, 0.1)', // Light blue background to make it visible
      }
    ]}>
      {children}
    </View>
  )
}
