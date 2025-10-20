import React from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { colors, typography, spacing } from '../theme'

export const ComponentLibraryScreen: React.FC = () => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Component Library</Text>
        <Text style={styles.subtitle}>Explore all stateless components in the app</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.instructionText}>
          Tap the menu button to open the component drawer and explore all available stateless components.
        </Text>
        
        <View style={styles.featureList}>
          <Text style={styles.featureTitle}>Features:</Text>
          <Text style={styles.featureItem}>• Interactive component showcase</Text>
          <Text style={styles.featureItem}>• Organized by component categories</Text>
          <Text style={styles.featureItem}>• Live component demonstrations</Text>
          <Text style={styles.featureItem}>• Swipe to close drawer</Text>
        </View>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.heading1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  instructionText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  featureList: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  featureItem: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
})
