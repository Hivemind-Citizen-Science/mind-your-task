import { StyleSheet } from 'react-native'
import { colors, spacing } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.stimulusBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontSize: 16,
  },
  haloContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  halo: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  haloLabel: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  phaseText: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontSize: 12,
  },
  answerText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
})
