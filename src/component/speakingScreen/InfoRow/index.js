import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../utils/Theme';
import OutlinedButton from './OutlinedButton';

const SpeakingInfoRow = ({ onPass }) => (
  <View style={styles.infoRow}>
    <View style={styles.questionTypeContainer}>
      <Text style={styles.questionTypeLabel}>Question Type</Text>
      <Text style={styles.questionTypeValue}>Individual Long Turn</Text>
    </View>
    <OutlinedButton
      title="Start Exam"
      icon="play-forward"
      iconPosition="right"
      onPress={onPass}
      style={styles.passButton}
    />
  </View>
);

const styles = StyleSheet.create({
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xxxl },
  questionTypeContainer: { flex: 1 },
  questionTypeLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs },
  questionTypeValue: { ...typography.bodyBold, color: colors.textPrimary },
  passButton: { marginLeft: spacing.lg },
});

export default SpeakingInfoRow;
