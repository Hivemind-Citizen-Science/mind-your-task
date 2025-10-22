import { StyleSheet } from 'react-native'
import { colors } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.stimulusBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aperture: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
  },
  dot: {
    position: 'absolute',
    backgroundColor: colors.stimulusElement,
    borderRadius: 2,
  },
})
