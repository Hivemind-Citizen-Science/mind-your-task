import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing } from '../../theme'

interface DrawerToggleProps {
  onPress: () => void
  isOpen?: boolean
}

export const DrawerToggle: React.FC<DrawerToggleProps> = ({ onPress, isOpen = false }) => {
  return (
    <TouchableOpacity
      style={[styles.toggle, isOpen && styles.toggleActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.toggleText, isOpen && styles.toggleTextActive]}>
        {isOpen ? 'X' : '≡'}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  toggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 999,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.textPrimary,
  },
})
