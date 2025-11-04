import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

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
            Unlock advanced features and unlimited access
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
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#4A67FF', // ana renk
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  premiumIconText: {
    fontSize: 24,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  upgradeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A67FF',
  },
});

export default PremiumCard;
