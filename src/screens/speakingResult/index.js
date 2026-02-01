import React, { useRef, useState } from 'react';
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

const CATEGORY_META = [
  { id: 'grammar', title: 'Grammar', icon: 'library' },
  { id: 'fluency', title: 'Fluency', icon: 'refresh-circle' },
  { id: 'pronunciation', title: 'Pronunciation', icon: 'volume-high' },
  { id: 'vocabulary', title: 'Vocabulary', icon: 'chatbox-ellipses' },
];

const COMMENT_BANK = {
  overall_score: {
    low: 'Focus on the basics and practice daily to lift your overall band.',
    mid: 'Nice progress. Keep practicing to move into the high band.',
    high: 'Excellent overall performance. Keep it consistent.',
  },
  grammar: {
    low: 'Review sentence structure and basic tense usage.',
    mid: 'Good control with some mistakes. Keep refining.',
    high: 'Excellent grammar with only minor slips.',
  },
  fluency: {
    low: 'Try to reduce long pauses and hesitations.',
    mid: 'Flow is improving. Aim for smoother transitions.',
    high: 'Speech is smooth and confident throughout.',
  },
  pronunciation: {
    low: 'Focus on clarity and word stress.',
    mid: 'Mostly clear. Work on a few tricky sounds.',
    high: 'Pronunciation is clear and natural.',
  },
  vocabulary: {
    low: 'Add more range with topic-based words.',
    mid: 'Decent range. Try more precise terms.',
    high: 'Strong range with accurate word choice.',
  },
};

const getScoreTier = (score) => {
  if (score <= 3) return 'low';
  if (score <= 7) return 'mid';
  return 'high';
};

const formatScore = (score) => {
  if (!Number.isFinite(score)) return '-';
  return score.toFixed(1);
};

const SpeakingResultsScreen = ({ navigation, route }) => {
  // Get dayNumber from route params (passed from SpeakingStartScreen)
  const dayNumber = route?.params?.dayNumber || route?.params?.dayId || 1;
  
  // Hook to mark speaking step as completed
  const completeStepMutation = useCompleteStep();
  const completionSentRef = useRef(false);
  const [feedbackData] = useState({
    overall_score: 6.0,
    scores: {
      grammar: 6.0,
      fluency: 6.0,
      pronunciation: 6.0,
      vocabulary: 6.0,
    },
  });

  const handleBackPress = () => navigation.goBack();

  const feedbackLoading = false;
  const feedbackError = null;
  
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

  const overallScoreValue = Number(feedbackData?.overall_score ?? 0);
  const overallProgress = Math.min(100, Math.max(0, Math.round(overallScoreValue * 10)));
  const overallTier = getScoreTier(overallScoreValue);
  const overallComment = COMMENT_BANK.overall_score[overallTier];

  const categories = CATEGORY_META.map((meta) => {
    const scoreValue = Number(feedbackData?.scores?.[meta.id] ?? 0);
    const tier = getScoreTier(scoreValue);
    const progress = Math.min(100, Math.max(0, Math.round(scoreValue * 10)));
    const color = scoreValue >= 7 ? colors.success : scoreValue >= 5 ? colors.warning : colors.error;
    return {
      ...meta,
      score: formatScore(scoreValue),
      color,
      progress,
      description: COMMENT_BANK[meta.id][tier],
    };
  });

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

        {feedbackLoading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator color={colors.textPrimary} />
            <Text style={styles.stateMessage}>Loading feedback...</Text>
          </View>
        ) : feedbackError ? (
          <View style={styles.stateContainer}>
            <Text style={styles.stateMessage}>{feedbackError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => {}}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
        {/* Overall Score */}
        <View style={styles.overallScoreCard}>
          <Text style={styles.overallScore}>{formatScore(overallScoreValue)}</Text>
          <Text style={styles.overallScoreLabel}>Overall Band Score</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${overallProgress}%`,
                    backgroundColor: overallScoreValue >= 7
                      ? colors.success 
                      : overallScoreValue >= 5
                      ? colors.warning 
                      : colors.error
                  }
                ]} 
              />
            </View>
          </View>
          <Text style={styles.overallComment}>{overallComment}</Text>
        </View>

        {/* Improvement Message */}
        <Text style={styles.improvementMessage}>
          {overallComment}
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
          {categories.map((category) => (
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
        </>
        )}
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
  overallComment: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg },

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

  // States
  stateContainer: { alignItems: 'center', marginVertical: spacing.xxxl, gap: spacing.lg },
  stateMessage: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  retryButton: { backgroundColor: colors.cardBackground, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.lg },
  retryButtonText: { ...typography.bodyBold, color: colors.textPrimary },
});

export default SpeakingResultsScreen;
