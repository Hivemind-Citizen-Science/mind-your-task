import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { colors, typography, spacing } from '../../theme'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')
const MOCKUP_WIDTH = screenWidth * 0.6
const MOCKUP_HEIGHT = screenHeight * 0.4

interface ScreenShowcaseProps {
  name: string
  description: string
  component: React.ReactNode
  category: string
}

export const ScreenShowcase: React.FC<ScreenShowcaseProps> = ({ 
  name, 
  description, 
  component, 
  category 
}) => {
  return (
    <View style={styles.showcaseItem}>
      <View style={styles.showcaseHeader}>
        <Text style={styles.screenName}>{name}</Text>
        <Text style={styles.screenCategory}>{category}</Text>
      </View>
      <Text style={styles.screenDescription}>{description}</Text>
      <View style={styles.screenContainer}>
        {component}
      </View>
    </View>
  )
}

// Welcome Screen Mockup
export const WelcomeScreenMockup: React.FC = () => {
  return (
    <View style={styles.screenMockup}>
      <View style={styles.mockupHeader}>
        <Text style={styles.mockupTitle}>Mind Your Task</Text>
        <Text style={styles.mockupSubtitle}>Research Task App</Text>
        <Text style={styles.mockupPhase}>Phase 1: Calibration</Text>
      </View>
      
      <View style={styles.mockupDescription}>
        <Text style={styles.mockupDescriptionText}>
          Welcome to the research task application...
        </Text>
      </View>
      
      <View style={styles.mockupButtonContainer}>
        <View style={styles.mockupButton}>
          <Text style={styles.mockupButtonText}>Get Started</Text>
        </View>
      </View>
    </View>
  )
}

// Calibration Screen Mockup
export const CalibrationScreenMockup: React.FC = () => {
  return (
    <View style={styles.screenMockup}>
      <View style={styles.mockupTrialCounter}>
        <Text style={styles.mockupCounterText}>Trial 3 of 10</Text>
      </View>
      
      <View style={styles.mockupCenterContent}>
        <View style={styles.mockupFixationCross}>
          <View style={styles.mockupHorizontalLine} />
          <View style={styles.mockupVerticalLine} />
        </View>
      </View>
      
      <View style={styles.mockupSwipeArea}>
        <View style={styles.mockupChoiceZoneLeft}>
          <Text style={styles.mockupChoiceText}>LEFT</Text>
        </View>
        <View style={styles.mockupChoiceZoneRight}>
          <Text style={styles.mockupChoiceText}>RIGHT</Text>
        </View>
      </View>
    </View>
  )
}

// Home Screen Mockup
export const HomeScreenMockup: React.FC = () => {
  return (
    <View style={styles.screenMockup}>
      <View style={styles.mockupHomeContent}>
        <Text style={styles.mockupHomeTitle}>Home Screen</Text>
        <Text style={styles.mockupHomeMessage}>
          Phase 2 will build the full home screen...
        </Text>
        <Text style={styles.mockupHomeMessage}>
          For now, you've successfully completed the calibration task!
        </Text>
      </View>
    </View>
  )
}

// Component Library Screen Mockup
export const ComponentLibraryScreenMockup: React.FC = () => {
  return (
    <View style={styles.screenMockup}>
      <View style={styles.mockupLibraryHeader}>
        <Text style={styles.mockupLibraryTitle}>Component Library</Text>
        <Text style={styles.mockupLibrarySubtitle}>
          Explore all stateless components in the app
        </Text>
      </View>
      
      <View style={styles.mockupLibraryContent}>
        <Text style={styles.mockupLibraryText}>
          Tap the menu button to open the component drawer...
        </Text>
        
        <View style={styles.mockupFeatureList}>
          <Text style={styles.mockupFeatureTitle}>Features:</Text>
          <Text style={styles.mockupFeatureItem}>• Interactive component showcase</Text>
          <Text style={styles.mockupFeatureItem}>• Organized by component categories</Text>
        </View>
      </View>
    </View>
  )
}

// Color Palette Mockup
export const ColorPaletteMockup: React.FC = () => {
  return (
    <View style={styles.screenMockup}>
      <Text style={styles.mockupPaletteTitle}>Color Palette</Text>
      <View style={styles.mockupColorGrid}>
        <View style={styles.mockupColorRow}>
          <View style={[styles.mockupColorSwatch, { backgroundColor: colors.primary }]}>
            <Text style={styles.mockupColorLabel}>Primary</Text>
          </View>
          <View style={[styles.mockupColorSwatch, { backgroundColor: colors.background }]}>
            <Text style={styles.mockupColorLabel}>Background</Text>
          </View>
          <View style={[styles.mockupColorSwatch, { backgroundColor: colors.surface }]}>
            <Text style={styles.mockupColorLabel}>Surface</Text>
          </View>
        </View>
        <View style={styles.mockupColorRow}>
          <View style={[styles.mockupColorSwatch, { backgroundColor: colors.success }]}>
            <Text style={styles.mockupColorLabel}>Success</Text>
          </View>
          <View style={[styles.mockupColorSwatch, { backgroundColor: colors.error }]}>
            <Text style={styles.mockupColorLabel}>Error</Text>
          </View>
          <View style={[styles.mockupColorSwatch, { backgroundColor: colors.warning }]}>
            <Text style={styles.mockupColorLabel}>Warning</Text>
          </View>
        </View>
        <View style={styles.mockupColorRow}>
          <View style={[styles.mockupColorSwatch, { backgroundColor: colors.textPrimary }]}>
            <Text style={[styles.mockupColorLabel, { color: colors.background }]}>Text Primary</Text>
          </View>
          <View style={[styles.mockupColorSwatch, { backgroundColor: colors.textSecondary }]}>
            <Text style={[styles.mockupColorLabel, { color: colors.background }]}>Text Secondary</Text>
          </View>
          <View style={[styles.mockupColorSwatch, { backgroundColor: colors.border }]}>
            <Text style={[styles.mockupColorLabel, { color: colors.background }]}>Border</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  showcaseItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  showcaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  screenName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  screenCategory: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  screenDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  screenContainer: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  
  // Screen mockup styles
  screenMockup: {
    width: MOCKUP_WIDTH,
    height: MOCKUP_HEIGHT,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Welcome screen mockup
  mockupHeader: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  mockupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  mockupSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  mockupPhase: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  mockupDescription: {
    marginBottom: spacing.sm,
  },
  mockupDescriptionText: {
    fontSize: 8,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 12,
  },
  mockupButtonContainer: {
    width: '100%',
  },
  mockupButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  mockupButtonText: {
    fontSize: 10,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  
  // Calibration screen mockup
  mockupTrialCounter: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  mockupCounterText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  mockupCenterContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  mockupFixationCross: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockupHorizontalLine: {
    position: 'absolute',
    width: 10,
    height: 1.5,
    backgroundColor: colors.stimulusElement,
    borderRadius: 1,
  },
  mockupVerticalLine: {
    position: 'absolute',
    width: 1.5,
    height: 10,
    backgroundColor: colors.stimulusElement,
    borderRadius: 1,
  },
  mockupSwipeArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  mockupChoiceZoneLeft: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockupChoiceZoneRight: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockupChoiceText: {
    fontSize: 8,
    color: '#4A90E2',
    fontWeight: '600',
  },
  
  // Home screen mockup
  mockupHomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockupHomeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  mockupHomeMessage: {
    fontSize: 8,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 12,
    marginBottom: 4,
  },
  
  // Component library screen mockup
  mockupLibraryHeader: {
    marginBottom: spacing.sm,
  },
  mockupLibraryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  mockupLibrarySubtitle: {
    fontSize: 8,
    color: colors.textSecondary,
  },
  mockupLibraryContent: {
    flex: 1,
  },
  mockupLibraryText: {
    fontSize: 8,
    color: colors.textPrimary,
    lineHeight: 12,
    marginBottom: spacing.sm,
  },
  mockupFeatureList: {
    backgroundColor: colors.surface,
    padding: spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mockupFeatureTitle: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  mockupFeatureItem: {
    fontSize: 7,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  
  // Color palette mockup
  mockupPaletteTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  mockupColorGrid: {
    flex: 1,
  },
  mockupColorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  mockupColorSwatch: {
    width: 40,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mockupColorLabel: {
    fontSize: 6,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
})
