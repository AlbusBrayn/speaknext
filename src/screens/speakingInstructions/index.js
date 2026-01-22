import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../utils/Theme';

const SpeakingInstructionsScreen = ({ navigation, route }) => {
  const dayNumber = route?.params?.dayNumber || 1;
  const resume = route?.params?.resume === true;

  const handleBack = () => {
    navigation.navigate('SpeakingIntroScreen', { dayNumber, resume });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundAccent} />
      <View style={styles.backgroundAccentTwo} />

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Speaking Instructions</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Day {dayNumber}</Text>
          <Text style={styles.heroTitle}>Get Ready for the Speaking Exam</Text>
          <Text style={styles.heroSubtitle}>
            You will watch a short prompt video and then record your answer. Speak clearly
            and stay on topic.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How it works</Text>
          <View style={styles.bulletRow}>
            <Ionicons name="play-circle" size={18} color={colors.primary} />
            <Text style={styles.bulletText}>Watch the prompt video to understand the task.</Text>
          </View>
          <View style={styles.bulletRow}>
            <Ionicons name="mic" size={18} color={colors.primary} />
            <Text style={styles.bulletText}>Tap the microphone to start and stop recording.</Text>
          </View>
          <View style={styles.bulletRow}>
            <Ionicons name="cloud-upload" size={18} color={colors.primary} />
            <Text style={styles.bulletText}>Your answer is uploaded automatically after you finish.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Scoring tips</Text>
          <View style={styles.tipGrid}>
            <View style={styles.tipItem}>
              <Ionicons name="chatbubble-ellipses" size={18} color={colors.textPrimary} />
              <Text style={styles.tipText}>Answer fully and stay relevant.</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="volume-high" size={18} color={colors.textPrimary} />
              <Text style={styles.tipText}>Speak clearly and at a steady pace.</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="time" size={18} color={colors.textPrimary} />
              <Text style={styles.tipText}>Use the full time to develop ideas.</Text>
            </View>
          </View>
        </View>

        <View style={styles.notice}>
          <Ionicons name="alert-circle" size={18} color={colors.primary} />
          <Text style={styles.noticeText}>
            Make sure your microphone permission is enabled before starting.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundAccent: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(68, 96, 205, 0.08)',
  },
  backgroundAccentTwo: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(68, 96, 205, 0.06)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerTitle: {
    ...typography.headline,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  heroCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  heroEyebrow: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  bulletText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  tipGrid: {
    gap: spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(68, 96, 205, 0.08)',
  },
  tipText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(68, 96, 205, 0.12)',
    marginTop: spacing.sm,
  },
  noticeText: {
    ...typography.callout,
    color: colors.textPrimary,
    flex: 1,
  },
});

export default SpeakingInstructionsScreen;
