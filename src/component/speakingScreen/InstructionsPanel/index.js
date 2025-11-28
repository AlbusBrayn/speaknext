import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../../utils/Theme';

const InstructionsPanel = ({ 
  onPress, 
  text = "Listen carefully to the question.", 
  title = "Instructions" 
}) => (
  <TouchableOpacity style={styles.instructionsPanel} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.instructionsContent}>
      <View style={styles.instructionsLeft}>
        <View style={styles.infoIconContainer}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
        </View>
        <View style={styles.instructionsText}>
          <Text style={styles.instructionsTitle}>{title}</Text>
          <Text style={styles.instructionsCaption}>{text}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  instructionsPanel: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  instructionsContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  instructionsLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  infoIconContainer: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(74, 103, 255, 0.1)',
    justifyContent: 'center', alignItems: 'center',
    marginRight: spacing.lg,
  },
  instructionsText: { flex: 1 },
  instructionsTitle: { ...typography.headline, color: colors.textPrimary, marginBottom: spacing.xs },
  instructionsCaption: { ...typography.callout, color: colors.textSecondary },
});

export default InstructionsPanel;
