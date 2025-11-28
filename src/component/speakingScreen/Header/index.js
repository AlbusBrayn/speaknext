import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../utils/Theme';

const SpeakingHeader = ({ 
  title = "Speaking Day 1", 
  subtitle = "Video Question Playback",
  onBack 
}) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, marginBottom: spacing.xxxl },
  title: { ...typography.title2, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary },
});

export default SpeakingHeader;
