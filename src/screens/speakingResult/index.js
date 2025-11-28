import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../utils/Theme';
import SpeakingHeader from '../../component/speakingScreen/Header';
import ResultCategoryCard from '../../component/speakingScreen/Result';
import { useCompleteStep } from '../../hooks/updateStep';

// Mock results data
const RESULTS_DATA = {
  overallScore: 6.5,
  overallProgress: 65,
  improvementMessage: "Great job! You have improved since your last test. Your Vocabulary score is good.",
  categories: [
    {
      id: 'grammar',
      title: 'Grammar',
      score: 9.0,
      color: colors.success,
      progress: 90,
      description: 'Excellent grammar usage with minimal errors!',
      icon: 'library',
    },
    {
      id: 'fluency',
      title: 'Fluency',
      score: 2.5,
      color: colors.error,
      progress: 25,
      description: 'Work on reducing pauses and hesitations.',
      icon: 'refresh-circle',
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation',
      score: 9.0,
      color: colors.success,
      progress: 90,
      description: 'Clear and accurate pronunciation throughout.',
      icon: 'volume-high',
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary',
      score: 6.0,
      color: colors.warning,
      progress: 60,
      description: 'Good range but try more advanced words.',
      icon: 'chatbox-ellipses',
    },
  ],
};

const SpeakingResultsScreen = ({ navigation, route }) => {
  // Get dayNumber from route params (passed from SpeakingStartScreen)
  const dayNumber = route?.params?.dayNumber || route?.params?.dayId || 1;
  
  // Hook to mark speaking step as completed
  const completeStepMutation = useCompleteStep();
  const completionSentRef = useRef(false);

  const handleBackPress = () => navigation.goBack();
  
  // Mark speaking as completed before navigating back
  const handleBackToFeedback = () => {
    // Prevent duplicate calls
    if (completionSentRef.current) return;
    completionSentRef.current = true;

    console.log('[SpeakingResult] Completing speaking step for day', dayNumber);

    completeStepMutation.mutate(
      {
        day_number: dayNumber,
        step: 'speaking',
      },
      {
        onSuccess: (data) => {
          console.log('[SpeakingResult] Speaking step completed successfully', data);
          // Navigate back to main tabs after successful completion
          navigation.navigate('MainTabs');
        },
        onError: (error) => {
          console.log('[SpeakingResult] Step completion error', error);
          completionSentRef.current = false; // Allow retry
          Alert.alert(
            'Error',
            'Failed to update progress. Please try again.',
            [
              {
                text: 'Go Back Anyway',
                onPress: () => navigation.navigate('MainTabs'),
              },
              { text: 'Retry', onPress: handleBackToFeedback },
            ]
          );
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <SpeakingHeader 
          title={`Speaking Day ${dayNumber}`} 
          onBack={handleBackPress}
        />

        {/* Overall Score */}
        <View style={styles.overallScoreCard}>
          <Text style={styles.overallScore}>{RESULTS_DATA.overallScore}</Text>
          <Text style={styles.overallScoreLabel}>Overall Band Score</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${RESULTS_DATA.overallProgress}%`,
                    backgroundColor: RESULTS_DATA.overallScore >= 7
                      ? colors.success 
                      : RESULTS_DATA.overallScore >= 5
                      ? colors.warning 
                      : colors.error
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Improvement Message */}
        <Text style={styles.improvementMessage}>
          {RESULTS_DATA.improvementMessage}
        </Text>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mic" size={20} color={colors.textPrimary} />
            <Text style={styles.actionButtonText}>Your Recording</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Detailed Report</Text>
          </TouchableOpacity>
        </View>

        {/* Category Cards */}
        <View style={styles.categoriesGrid}>
          {RESULTS_DATA.categories.map((category) => (
            <ResultCategoryCard 
              key={category.id} 
              category={category} 
              onPress={() => console.log(`Tapped ${category.id}`)} 
            />
          ))}
        </View>

        {/* Back to Feedback */}
        <TouchableOpacity 
          style={styles.backToFeedbackButton}
          onPress={handleBackToFeedback}
          disabled={completeStepMutation.isPending}
        >
          {completeStepMutation.isPending ? (
            <ActivityIndicator color={colors.textPrimary} />
          ) : (
            <Text style={styles.backToFeedbackText}>Back to Feedback</Text>
          )}
        </TouchableOpacity>

        {/* Feedback Rating */}
        <View style={styles.feedbackRatingContainer}>
          <Text style={styles.feedbackRatingQuestion}>
            How did you like the feedback on [skill]?
          </Text>
          
          <View style={styles.feedbackRatingButtons}>
            <TouchableOpacity style={styles.feedbackRatingButton}>
              <Ionicons name="thumbs-up" size={32} color={colors.textSecondary} />
              <Text style={styles.feedbackRatingLabel}>Helpful</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.feedbackRatingButton}>
              <Ionicons name="thumbs-down" size={32} color={colors.textSecondary} />
              <Text style={styles.feedbackRatingLabel}>Not helpful</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },

  // Overall Score
  overallScoreCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.xxxl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  overallScore: { fontSize: 64, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  overallScoreLabel: { ...typography.headline, color: colors.textSecondary, marginBottom: spacing.xl },
  progressContainer: { width: '100%', marginTop: spacing.lg },
  progressTrack: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },

  // Improvement
  improvementMessage: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xxxl, lineHeight: 24 },

  // Actions
  actionButtonsContainer: { gap: spacing.lg, marginBottom: spacing.xxxl },
  actionButton: { backgroundColor: colors.cardBackground, borderRadius: borderRadius.lg, padding: spacing.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  actionButtonText: { ...typography.bodyBold, color: colors.textPrimary },

  // Categories Grid
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, marginBottom: spacing.xxxl },

  // Back
  backToFeedbackButton: { backgroundColor: colors.cardBackground, borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.xxxl },
  backToFeedbackText: { ...typography.bodyBold, color: colors.textPrimary },

  // Feedback Rating
  feedbackRatingContainer: { alignItems: 'center' },
  feedbackRatingQuestion: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  feedbackRatingButtons: { flexDirection: 'row', gap: spacing.xxxl },
  feedbackRatingButton: { alignItems: 'center', gap: spacing.md },
  feedbackRatingLabel: { ...typography.callout, color: colors.textSecondary },
});

export default SpeakingResultsScreen;
