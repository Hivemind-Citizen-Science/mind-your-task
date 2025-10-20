import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { colors, spacing } from '../../theme'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  elevated?: boolean
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  elevated = true 
}) => {
  return (
    <View style={[
      styles.card,
      elevated && styles.elevated,
      style
    ]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
})
