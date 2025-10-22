import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native'
import { colors, typography, spacing } from '../theme'
import { Session, Trial } from '../types'
import { getAllSessions, getTrialsBySession } from '../utils/storage'
import { generateTestData } from '../utils/testDataGenerator'

export interface SessionWithTrials extends Session {
  trials: Trial[]
}

export interface ResultsDisplayScreenProps {
  sessions?: SessionWithTrials[]
  isLoading?: boolean
  onSessionPress?: (session: SessionWithTrials) => void
}

const TASK_NAMES = {
  calibration: 'Calibration',
  dot_kinematogram: 'Random Dot Motion',
  halo_travel: 'Halo Travel'
}

const PERIOD_NAMES = {
  morning: 'Morning',
  afternoon: 'Afternoon', 
  evening: 'Evening',
  night: 'Night'
}

export const ResultsDisplayScreen: React.FC<ResultsDisplayScreenProps> = ({
  sessions: propSessions,
  isLoading: propIsLoading = false,
  onSessionPress
}) => {
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set())
  const [sessions, setSessions] = useState<SessionWithTrials[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load sessions and trials from storage
  const loadSessionsData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get all sessions from storage
      const allSessions = getAllSessions()
      
      // Sort sessions by started_at (most recent first)
      const sortedSessions = allSessions.sort((a, b) => b.started_at - a.started_at)

      // Load trials for each session
      const sessionsWithTrials: SessionWithTrials[] = sortedSessions.map(session => ({
        ...session,
        trials: getTrialsBySession(session.session_id)
      }))

      setSessions(sessionsWithTrials)
    } catch (err) {
      console.error('Failed to load sessions data:', err)
      setError('Failed to load session data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Only load data if no sessions were provided as props
    if (!propSessions || propSessions.length === 0) {
      loadSessionsData()
    } else {
      setSessions(propSessions)
      setIsLoading(propIsLoading)
    }
  }, [propSessions, propIsLoading])

  const handleGenerateTestData = () => {
    generateTestData()
    loadSessionsData() // Refresh the data
  }

  const toggleSession = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions)
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId)
    } else {
      newExpanded.add(sessionId)
    }
    setExpandedSessions(newExpanded)
  }

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString()
  }

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const calculateSessionStats = (trials: Trial[]) => {
    const completedTrials = trials.filter(t => !t.no_response)
    const correctTrials = completedTrials.filter(t => t.is_correct)
    const responseTimes = completedTrials.map(t => t.response_time_ms)
    
    return {
      totalTrials: trials.length,
      completedTrials: completedTrials.length,
      correctTrials: correctTrials.length,
      accuracy: completedTrials.length > 0 ? Math.round((correctTrials.length / completedTrials.length) * 100) : 0,
      avgResponseTime: responseTimes.length > 0 ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0,
      fastestTime: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
      slowestTime: responseTimes.length > 0 ? Math.max(...responseTimes) : 0
    }
  }

  const getSessionStatusColor = (session: Session) => {
    if (session.completed) return colors.success
    if (session.completed_at) return colors.warning
    return colors.textSecondary
  }

  const getSessionStatusText = (session: Session) => {
    if (session.completed) return 'Completed'
    if (session.completed_at) return 'Partial'
    return 'Incomplete'
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading session results...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Data</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (sessions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Session Results</Text>
          <Text style={styles.emptySubtitle}>
            Complete some sessions to see your results here
          </Text>
          <TouchableOpacity 
            style={styles.testDataButton}
            onPress={handleGenerateTestData}
          >
            <Text style={styles.testDataButtonText}>Generate Test Data</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Session Results</Text>
        <Text style={styles.subtitle}>
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} completed
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sessions.map((session) => {
          const isExpanded = expandedSessions.has(session.session_id)
          const stats = calculateSessionStats(session.trials)
          const statusColor = getSessionStatusColor(session)
          const statusText = getSessionStatusText(session)

          return (
            <View key={session.session_id} style={styles.sessionCard}>
              <TouchableOpacity
                style={styles.sessionHeader}
                onPress={() => {
                  toggleSession(session.session_id)
                  onSessionPress?.(session)
                }}
                activeOpacity={0.7}
              >
                <View style={styles.sessionHeaderLeft}>
                  <Text style={styles.sessionTitle}>
                    {TASK_NAMES[session.task_type as keyof typeof TASK_NAMES] || session.task_type}
                  </Text>
                  <Text style={styles.sessionDate}>
                    {formatDate(session.started_at)} • {formatTime(session.started_at)}
                  </Text>
                  <Text style={styles.sessionPeriod}>
                    {PERIOD_NAMES[session.period_type as keyof typeof PERIOD_NAMES] || session.period_type}
                    {session.is_practice && ' (Practice)'}
                    {session.is_post_study && ' (Post-Study)'}
                  </Text>
                </View>
                
                <View style={styles.sessionHeaderRight}>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                    <Text style={styles.statusText}>{statusText}</Text>
                  </View>
                  <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.sessionDetails}>
                  {/* Quick Stats */}
                  <View style={styles.quickStats}>
                    <View style={styles.quickStatItem}>
                      <Text style={styles.quickStatValue}>{stats.accuracy}%</Text>
                      <Text style={styles.quickStatLabel}>Accuracy</Text>
                    </View>
                    <View style={styles.quickStatItem}>
                      <Text style={styles.quickStatValue}>{stats.avgResponseTime}ms</Text>
                      <Text style={styles.quickStatLabel}>Avg Response</Text>
                    </View>
                    <View style={styles.quickStatItem}>
                      <Text style={styles.quickStatValue}>{stats.completedTrials}/{stats.totalTrials}</Text>
                      <Text style={styles.quickStatLabel}>Completed</Text>
                    </View>
                  </View>

                  {/* Detailed Stats */}
                  <View style={styles.detailedStats}>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Correct Trials:</Text>
                      <Text style={styles.statValue}>{stats.correctTrials}/{stats.completedTrials}</Text>
                    </View>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Response Time Range:</Text>
                      <Text style={styles.statValue}>{stats.fastestTime}ms - {stats.slowestTime}ms</Text>
                    </View>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Session Duration:</Text>
                      <Text style={styles.statValue}>
                        {session.completed_at 
                          ? `${Math.round((session.completed_at - session.started_at) / 1000 / 60)} minutes`
                          : 'Incomplete'
                        }
                      </Text>
                    </View>
                  </View>

                  {/* Trial Breakdown */}
                  {session.trials.length > 0 && (
                    <View style={styles.trialBreakdown}>
                      <Text style={styles.trialBreakdownTitle}>Trial Performance</Text>
                      <View style={styles.trialList}>
                        {session.trials.slice(0, 10).map((trial, index) => (
                          <View key={trial.trial_id} style={styles.trialItem}>
                            <Text style={styles.trialNumber}>#{trial.trial_number}</Text>
                            <Text style={styles.trialResponse}>
                              {trial.user_response || 'No response'}
                            </Text>
                            <Text style={styles.trialCorrect}>
                              {trial.is_correct ? '✓' : '✗'}
                            </Text>
                            <Text style={styles.trialTime}>
                              {trial.response_time_ms}ms
                            </Text>
                          </View>
                        ))}
                        {session.trials.length > 10 && (
                          <Text style={styles.moreTrialsText}>
                            ... and {session.trials.length - 10} more trials
                          </Text>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    ...typography.heading2,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  errorSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  testDataButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  testDataButtonText: {
    ...typography.body,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  header: {
    padding: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.heading1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  sessionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  sessionHeaderLeft: {
    flex: 1,
  },
  sessionTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sessionDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  sessionPeriod: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sessionHeaderRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginBottom: spacing.xs,
  },
  statusText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  expandIcon: {
    ...typography.body,
    color: colors.textSecondary,
  },
  sessionDetails: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    ...typography.heading2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  quickStatLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  detailedStats: {
    marginBottom: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  statLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  trialBreakdown: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  trialBreakdownTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  trialList: {
    maxHeight: 200,
  },
  trialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  trialNumber: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 40,
  },
  trialResponse: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
    marginLeft: spacing.sm,
  },
  trialCorrect: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 20,
    textAlign: 'center',
  },
  trialTime: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 60,
    textAlign: 'right',
  },
  moreTrialsText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.sm,
    fontStyle: 'italic',
  },
})
