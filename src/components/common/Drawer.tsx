import React, { useState } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Animated
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import { colors, typography, spacing } from '../../theme'
import { RootStackParamList } from '../../types'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')
const DRAWER_WIDTH = screenWidth * 0.85
const DRAWER_HEIGHT = screenHeight * 0.9

interface DrawerProps {
  isVisible: boolean
  onClose: () => void
  children?: React.ReactNode
  onNavigate?: (screenName: keyof RootStackParamList) => void
}

interface ComponentShowcaseProps {
  name: string
  description: string
  component: React.ReactNode
}

const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ 
  name, 
  description, 
  component
}) => {
  return (
    <View style={styles.showcaseItem}>
      <View style={styles.showcaseHeader}>
        <Text style={styles.componentName}>{name}</Text>
      </View>
      <Text style={styles.componentDescription}>{description}</Text>
      <View style={styles.componentContainer}>
        {component}
      </View>
    </View>
  )
}

interface ScreenNavigationProps {
  name: string
  description: string
  screenName: keyof RootStackParamList
  onNavigate: () => void
}

const ScreenNavigation: React.FC<ScreenNavigationProps> = ({ 
  name, 
  description, 
  screenName,
  onNavigate
}) => {
  return (
    <View style={styles.showcaseItem}>
      <View style={styles.showcaseHeader}>
        <Text style={styles.componentName}>{name}</Text>
      </View>
      <Text style={styles.componentDescription}>{description}</Text>
      <TouchableOpacity 
        style={styles.navigationButton}
        onPress={onNavigate}
      >
        <Text style={styles.navigationButtonText}>View {name}</Text>
      </TouchableOpacity>
    </View>
  )
}

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  children, 
  isExpanded, 
  onToggle 
}) => {
  return (
    <View style={styles.categorySection}>
      <TouchableOpacity 
        style={styles.categoryHeader} 
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.categoryTitle}>{title}</Text>
        <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.categoryContent}>
          {children}
        </View>
      )}
    </View>
  )
}

export const Drawer: React.FC<DrawerProps> = ({ isVisible, onClose, children, onNavigate }) => {
  const [translateX] = useState(new Animated.Value(DRAWER_WIDTH))
  const [gestureX] = useState(new Animated.Value(0))
  const insets = useSafeAreaInsets()
  
  // State for tracking which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    commonComponents: true,
    trialFlowComponents: true,
    swipeInteractionComponents: true,
    errorHandling: true,
    screenNavigation: true,
  })
  
  const toggleSection = (sectionKey: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  React.useEffect(() => {
    if (isVisible) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start()
    } else {
      Animated.timing(translateX, {
        toValue: DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [isVisible, translateX])

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: gestureX } }],
    { useNativeDriver: true }
  )

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent
      
      if (translationX > DRAWER_WIDTH * 0.3 || velocityX > 500) {
        // Close drawer
        Animated.timing(translateX, {
          toValue: DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onClose()
        })
      } else {
        // Snap back
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start()
      }
      
      gestureX.setValue(0)
    }
  }

  const animatedStyle = {
    transform: [
      {
        translateX: Animated.add(translateX, gestureX),
      },
    ],
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={onClose}
      />
      
      {/* Drawer Content */}
      <Animated.View style={[styles.drawer, { top: insets.top, height: DRAWER_HEIGHT - insets.top }, animatedStyle]}>
        <SafeAreaView style={styles.safeArea} edges={['right']}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Component Library</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.drawerContent} showsVerticalScrollIndicator={false}>
            {/* Common Components */}
            <CollapsibleSection
              title="Common Components"
              isExpanded={expandedSections.commonComponents}
              onToggle={() => toggleSection('commonComponents')}
            >
              <ComponentShowcase
                name="Button"
                description="Reusable button component with primary and secondary variants"
                component={
                  <View style={styles.buttonShowcase}>
                    <TouchableOpacity style={styles.primaryButton}>
                      <Text style={styles.buttonText}>Primary Button</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton}>
                      <Text style={styles.secondaryButtonText}>Secondary Button</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
              
              <ComponentShowcase
                name="Card"
                description="Container component with elevation and rounded corners"
                component={
                  <View style={styles.cardShowcase}>
                    <Text style={styles.cardText}>Card Content</Text>
                  </View>
                }
              />
              
              <ComponentShowcase
                name="MobileContainer"
                description="Web mobile simulation wrapper for consistent mobile experience"
                component={
                  <View style={styles.mobileContainerShowcase}>
                    <Text style={styles.mobileContainerText}>Mobile Container</Text>
                  </View>
                }
              />
            </CollapsibleSection>

            {/* TrialFlow Components */}
            <CollapsibleSection
              title="TrialFlow Components"
              isExpanded={expandedSections.trialFlowComponents}
              onToggle={() => toggleSection('trialFlowComponents')}
            >
              <ComponentShowcase
                name="StartButton"
                description="Button to initiate trial sequences"
                component={
                  <TouchableOpacity style={styles.startButtonShowcase}>
                    <Text style={styles.startButtonText}>Start Trial</Text>
                  </TouchableOpacity>
                }
              />
              
              <ComponentShowcase
                name="FixationCross"
                description="Cross-hair for fixation periods"
                component={
                  <View style={styles.fixationCrossShowcase}>
                    <View style={styles.horizontalLine} />
                    <View style={styles.verticalLine} />
                  </View>
                }
              />
              
              <ComponentShowcase
                name="FeedbackOverlay"
                description="Animated feedback circle for trial results"
                component={
                  <View style={styles.feedbackShowcase}>
                    <View style={[styles.feedbackCircle, { backgroundColor: colors.feedbackCorrect }]} />
                    <View style={[styles.feedbackCircle, { backgroundColor: colors.feedbackIncorrect, marginLeft: 20 }]} />
                  </View>
                }
              />
            </CollapsibleSection>

            {/* SwipeInteraction Components */}
            <CollapsibleSection
              title="SwipeInteraction Components"
              isExpanded={expandedSections.swipeInteractionComponents}
              onToggle={() => toggleSection('swipeInteractionComponents')}
            >
              <ComponentShowcase
                name="ChoiceZone"
                description="Left and right choice areas for swipe interactions"
                component={
                  <View style={styles.choiceZoneShowcase}>
                    <View style={styles.choiceZoneLeft}>
                      <Text style={styles.choiceZoneText}>LEFT</Text>
                    </View>
                    <View style={styles.choiceZoneRight}>
                      <Text style={styles.choiceZoneText}>RIGHT</Text>
                    </View>
                  </View>
                }
              />
              
              <ComponentShowcase
                name="Coin"
                description="Draggable coin element for swipe gestures"
                component={
                  <View style={styles.coinShowcase}>
                    <View style={styles.coin} />
                  </View>
                }
              />
              
              <ComponentShowcase
                name="StartZone"
                description="Starting position zone for swipe interactions"
                component={
                  <View style={styles.startZoneShowcase}>
                    <View style={styles.startZone} />
                  </View>
                }
              />
              
              <ComponentShowcase
                name="Trail"
                description="Swipe trajectory visualization component"
                component={
                  <View style={styles.trailShowcase}>
                    <View style={styles.trailLine} />
                  </View>
                }
              />
              
              <ComponentShowcase
                name="SwipeInteraction"
                description="Complete swipe interaction system with gesture detection, trajectory recording, and visual feedback"
                component={
                  <View style={styles.swipeInteractionShowcase}>
                    <View style={styles.swipeInteractionContainer}>
                      <View style={styles.swipeStartZone}>
                        <View style={styles.swipeStartZoneInner} />
                      </View>
                      <View style={styles.swipeChoiceZoneLeft}>
                        <Text style={styles.swipeChoiceText}>LEFT</Text>
                      </View>
                      <View style={styles.swipeChoiceZoneRight}>
                        <Text style={styles.swipeChoiceText}>RIGHT</Text>
                      </View>
                      <View style={styles.swipeCoin} />
                      <View style={styles.swipeTrail} />
                    </View>
                  </View>
                }
              />
            </CollapsibleSection>

            {/* Error Boundary */}
            <CollapsibleSection
              title="Error Handling"
              isExpanded={expandedSections.errorHandling}
              onToggle={() => toggleSection('errorHandling')}
            >
              <ComponentShowcase
                name="ErrorBoundary"
                description="Error boundary component for graceful error handling"
                component={
                  <View style={styles.errorBoundaryShowcase}>
                    <Text style={styles.errorText}>Error Boundary</Text>
                    <Text style={styles.errorSubtext}>Catches and displays errors</Text>
                  </View>
                }
              />
            </CollapsibleSection>

            {/* Screen Navigation */}
            <CollapsibleSection
              title="Screen Navigation"
              isExpanded={expandedSections.screenNavigation}
              onToggle={() => toggleSection('screenNavigation')}
            >
              <ScreenNavigation
                name="Welcome Screen"
                description="Initial welcome screen with app introduction and get started button"
                screenName="Welcome"
                onNavigate={() => {
                  onClose()
                  onNavigate?.('Welcome')
                }}
              />
              
              <ScreenNavigation
                name="Calibration Screen"
                description="Trial flow screen with fixation cross, choice zones, and trial counter"
                screenName="Calibration"
                onNavigate={() => {
                  onClose()
                  onNavigate?.('Calibration')
                }}
              />
              
              <ScreenNavigation
                name="Home Screen"
                description="Post-calibration home screen with completion message"
                screenName="Home"
                onNavigate={() => {
                  onClose()
                  onNavigate?.('Home')
                }}
              />
              
              <ScreenNavigation
                name="Task Screen"
                description="Main task execution screen for calibration, dot kinematogram, and halo travel tasks"
                screenName="Task"
                onNavigate={() => {
                  onClose()
                  onNavigate?.('Task')
                }}
              />
              
              <ScreenNavigation
                name="Session Completion Screen"
                description="Post-session summary screen showing completion status and results"
                screenName="SessionCompletion"
                onNavigate={() => {
                  onClose()
                  onNavigate?.('SessionCompletion')
                }}
              />
              
              <ScreenNavigation
                name="Component Library Screen"
                description="Component showcase screen with feature list and instructions"
                screenName="ComponentLibrary"
                onNavigate={() => {
                  onClose()
                  onNavigate?.('ComponentLibrary')
                }}
              />
              
              <ScreenNavigation
                name="SwipeInteraction Screen"
                description="Interactive swipe interface showing choice zones, start zone, coin, and trajectory visualization"
                screenName="SwipeInteraction"
                onNavigate={() => {
                  onClose()
                  onNavigate?.('SwipeInteraction')
                }}
              />
              
              <ScreenNavigation
                name="Results Display Screen"
                description="Comprehensive session results display with collapsible sessions, detailed statistics, and trial breakdowns"
                screenName="ResultsDisplay"
                onNavigate={() => {
                  onClose()
                  onNavigate?.('ResultsDisplay')
                }}
              />
            </CollapsibleSection>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: DRAWER_WIDTH,
    height: DRAWER_HEIGHT,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 1001,
  },
  safeArea: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drawerTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  drawerContent: {
    flex: 1,
    padding: spacing.lg,
  },
  categorySection: {
    marginBottom: spacing.xl,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    marginBottom: spacing.md,
  },
  categoryTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    flex: 1,
  },
  expandIcon: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  categoryContent: {
    // Content styles are handled by the children components
  },
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
  componentName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  componentCategory: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  componentDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  componentContainer: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  
  // Button showcase styles
  buttonShowcase: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  secondaryButton: {
    backgroundColor: colors.buttonSecondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  secondaryButtonText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  
  // Card showcase styles
  cardShowcase: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  
  // Mobile container showcase
  mobileContainerShowcase: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mobileContainerText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  
  // Start button showcase
  startButtonShowcase: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  startButtonText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  
  // Fixation cross showcase
  fixationCrossShowcase: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalLine: {
    position: 'absolute',
    width: 15,
    height: 2,
    backgroundColor: colors.stimulusElement,
    borderRadius: 1,
  },
  verticalLine: {
    position: 'absolute',
    width: 2,
    height: 15,
    backgroundColor: colors.stimulusElement,
    borderRadius: 1,
  },
  
  // Feedback showcase
  feedbackShowcase: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  
  // Choice zone showcase
  choiceZoneShowcase: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  choiceZoneLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceZoneRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceZoneText: {
    ...typography.caption,
    color: '#4A90E2',
    fontWeight: '600',
  },
  
  // Coin showcase
  coinShowcase: {
    alignItems: 'center',
  },
  coin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  
  // Start zone showcase
  startZoneShowcase: {
    alignItems: 'center',
  },
  startZone: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4A90E2',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Trail showcase
  trailShowcase: {
    alignItems: 'center',
  },
  trailLine: {
    width: 40,
    height: 3,
    backgroundColor: '#7AB8F5',
    borderRadius: 2,
    opacity: 0.7,
  },
  
  // Error boundary showcase
  errorBoundaryShowcase: {
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.error + '20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '600',
  },
  errorSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  
  // Navigation button styles
  navigationButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  navigationButtonText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  
  // SwipeInteraction showcase styles
  swipeInteractionShowcase: {
    alignItems: 'center',
  },
  swipeInteractionContainer: {
    width: 200,
    height: 120,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  swipeStartZone: {
    position: 'absolute',
    top: 20,
    left: 80,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeStartZoneInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  swipeChoiceZoneLeft: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeChoiceZoneRight: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeChoiceText: {
    fontSize: 8,
    color: '#4A90E2',
    fontWeight: '600',
  },
  swipeCoin: {
    position: 'absolute',
    top: 50,
    left: 90,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  swipeTrail: {
    position: 'absolute',
    top: 60,
    left: 90,
    width: 30,
    height: 2,
    backgroundColor: '#7AB8F5',
    borderRadius: 1,
    opacity: 0.7,
  },
})
