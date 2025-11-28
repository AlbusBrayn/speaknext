import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../../utils/Theme';

const PremiumCard = ({ onUpgrade }) => {
  return (
    <View style={styles.premiumCard}>
      <View style={styles.premiumContent}>
        <View style={styles.premiumIcon}>
          <Text style={styles.premiumIconText}>⭐</Text>
        </View>
        <View style={styles.premiumTextContainer}>
          <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          <Text style={styles.premiumSubtitle}>
            Unlock advanced speaking, grammar and feedback practice.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.upgradeButton}
        onPress={onUpgrade}
        accessibilityRole="button"
        accessibilityLabel="Upgrade to Premium"
        accessible={true}
      >
        <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  premiumCard: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.xxl,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    backgroundColor: colors.primary,
    ...Platform.select({
      ios: shadows.medium,
      android: shadows.medium,
    }),
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  premiumIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  premiumIconText: {
    fontSize: 24,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    ...typography.headline,
    color: colors.buttonText,
    marginBottom: spacing.xs,
  },
  premiumSubtitle: {
    ...typography.callout,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  upgradeButton: {
    backgroundColor: colors.buttonText,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxxl,
    alignItems: 'center',
  },
  upgradeButtonText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});

export default PremiumCard;
