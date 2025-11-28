import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../utils/Theme';
import ProgressBar from './ProgressBar';

const SpeakingProgress = ({ progress = 33, step = "Step 1 of 3" }) => (
  <View style={styles.progressSection}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressLabel}>Progress</Text>
      <Text style={styles.stepText}>{step}</Text>
    </View>
    <ProgressBar progress={progress} style={styles.progressBar} />
    <Text style={styles.progressPercentage}>{progress}% Complete</Text>
  </View>
);

const styles = StyleSheet.create({
  progressSection: { marginBottom: spacing.xxxl },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressLabel: { ...typography.headline, color: colors.textPrimary },
  stepText: { ...typography.callout, color: colors.primary },
  progressBar: { marginBottom: spacing.sm },
  progressPercentage: { ...typography.caption, color: colors.textSecondary },
});

export default SpeakingProgress;
