import React from 'react'
import { View, StyleSheet } from 'react-native'
import { colors } from '../../../theme'

export const FixationCross: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.horizontalLine} />
      <View style={styles.verticalLine} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalLine: {
    position: 'absolute',
    width: 20,
    height: 3,
    backgroundColor: colors.stimulusElement,
    borderRadius: 1.5,
  },
  verticalLine: {
    position: 'absolute',
    width: 3,
    height: 20,
    backgroundColor: colors.stimulusElement,
    borderRadius: 1.5,
  },
})
