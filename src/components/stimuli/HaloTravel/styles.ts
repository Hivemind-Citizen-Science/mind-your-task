import { StyleSheet } from 'react-native'
import { colors, spacing } from '../../../theme'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.stimulusBackground,
  },
  instruction: {
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: spacing.lg,
    alignSelf: 'center',
  },
  haloContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  answerText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
})
