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
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import { colors, typography, spacing } from '../../theme'
import { RootStackParamList } from '../../navigation/types'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')
const DRAWER_WIDTH = screenWidth * 0.8
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
  category: string
}

const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ 
  name, 
  description, 
  component, 
  category 
}) => {
  return (
    <View style={styles.showcaseItem}>
      <View style={styles.showcaseHeader}>
        <Text style={styles.componentName}>{name}</Text>
        <Text style={styles.componentCategory}>{category}</Text>
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
  category: string
  onNavigate: () => void
}

const ScreenNavigation: React.FC<ScreenNavigationProps> = ({ 
  name, 
  description, 
  screenName,
  category,
  onNavigate
}) => {
  return (
    <View style={styles.showcaseItem}>
      <View style={styles.showcaseHeader}>
        <Text style={styles.componentName}>{name}</Text>
        <Text style={styles.componentCategory}>{category}</Text>
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

export const Drawer: React.FC<DrawerProps> = ({ isVisible, onClose, children, onNavigate }) => {
  const [translateX] = useState(new Animated.Value(DRAWER_WIDTH))
  const [gestureX] = useState(new Animated.Value(0))

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
      <Animated.View style={[styles.drawer, animatedStyle]}>
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Component Library</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.drawerContent} showsVerticalScrollIndicator={false}>
            {/* Common Components */}
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Common Components</Text>
              
              <ComponentShowcase
                name="Button"
                description="Reusable button component with primary and secondary variants"
                category="Common"
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
                category="Common"
                component={
                  <View style={styles.cardShowcase}>
                    <Text style={styles.cardText}>Card Content</Text>
                  </View>
                }
              />
              
              <ComponentShowcase
                name="MobileContainer"
                description="Web mobile simulation wrapper for consistent mobile experience"
                category="Common"
                component={
                  <View style={styles.mobileContainerShowcase}>
                    <Text style={styles.mobileContainerText}>Mobile Container</Text>
                  </View>
                }
              />
            </View>

            {/* TrialFlow Components */}
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>TrialFlow Components</Text>
              
              <ComponentShowcase
                name="StartButton"
                description="Button to initiate trial sequences"
                category="TrialFlow"
                component={
                  <TouchableOpacity style={styles.startButtonShowcase}>
                    <Text style={styles.startButtonText}>Start Trial</Text>
                  </TouchableOpacity>
                }
              />
              
              <ComponentShowcase
                name="FixationCross"
                description="Cross-hair for fixation periods"
                category="TrialFlow"
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
                category="TrialFlow"
                component={
                  <View style={styles.feedbackShowcase}>
                    <View style={[styles.feedbackCircle, { backgroundColor: colors.feedbackCorrect }]} />
                    <View style={[styles.feedbackCircle, { backgroundColor: colors.feedbackIncorrect, marginLeft: 20 }]} />
                  </View>
                }
              />
            </View>

            {/* SwipeInteraction Components */}
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>SwipeInteraction Components</Text>
              
              <ComponentShowcase
                name="ChoiceZone"
                description="Left and right choice areas for swipe interactions"
                category="SwipeInteraction"
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
                category="SwipeInteraction"
                component={
                  <View style={styles.coinShowcase}>
                    <View style={styles.coin} />
                  </View>
                }
              />
              
              <ComponentShowcase
                name="StartZone"
                description="Starting position zone for swipe interactions"
                category="SwipeInteraction"
                component={
                  <View style={styles.startZoneShowcase}>
                    <View style={styles.startZone} />
                  </View>
                }
              />
              
              <ComponentShowcase
                name="Trail"
                description="Swipe trajectory visualization component"
                category="SwipeInteraction"
                component={
                  <View style={styles.trailShowcase}>
                    <View style={styles.trailLine} />
                  </View>
                }
              />
              
              <ComponentShowcase
                name="SwipeInteraction"
                description="Complete swipe interaction system with gesture detection, trajectory recording, and visual feedback"
                category="SwipeInteraction"
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
            </View>

            {/* Error Boundary */}
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Error Handling</Text>
              
              <ComponentShowcase
                name="ErrorBoundary"
                description="Error boundary component for graceful error handling"
                category="Error Handling"
                component={
                  <View style={styles.errorBoundaryShowcase}>
                    <Text style={styles.errorText}>Error Boundary</Text>
                    <Text style={styles.errorSubtext}>Catches and displays errors</Text>
                  </View>
                }
              />
            </View>

            {/* Screen Navigation */}
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Screen Navigation</Text>
              
              <ScreenNavigation
                name="Welcome Screen"
                description="Initial welcome screen with app introduction and get started button"
                screenName="Welcome"
                category="Screen Navigation"
                onNavigate={() => {
                  onClose()
                  onNavigate?.('Welcome')
                }}
              />
              
              <ScreenNavigation
                name="Calibration Screen"
                description="Trial flow screen with fixation cross, choice zones, and trial counter"
                screenName="Calibration"
                category="Screen Navigation"
                onNavigate={() => {
                  onClose()
                  onNavigate?.('Calibration')
                }}
              />
              
              <ScreenNavigation
                name="Home Screen"
                description="Post-calibration home screen with completion message"
                screenName="Home"
                category="Screen Navigation"
                onNavigate={() => {
                  onClose()
                  onNavigate?.('Home')
                }}
              />
              
              <ScreenNavigation
                name="Component Library Screen"
                description="Component showcase screen with feature list and instructions"
                screenName="ComponentLibrary"
                category="Screen Navigation"
                onNavigate={() => {
                  onClose()
                  onNavigate?.('ComponentLibrary')
                }}
              />
              
              <ScreenNavigation
                name="SwipeInteraction Screen"
                description="Interactive swipe interface showing choice zones, start zone, coin, and trajectory visualization"
                screenName="SwipeInteraction"
                category="Screen Navigation"
                onNavigate={() => {
                  onClose()
                  onNavigate?.('SwipeInteraction')
                }}
              />
            </View>
          </ScrollView>
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
  categoryTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
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
