import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BottomSection = ({ onContinue, onRestore }) => {
  return (
    <View style={styles.bottomSection}>
      {/* Continue Button */}
      <TouchableOpacity 
        style={styles.continueButtonContainer}
        onPress={onContinue}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#4A67FF', '#6B7FFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Restore Purchase */}
      <TouchableOpacity 
        onPress={onRestore}
        style={styles.restoreButton}
        activeOpacity={0.7}
      >
        <Text style={styles.restoreButtonText}>Restore Purchase</Text>
      </TouchableOpacity>

      {/* Terms and Privacy */}
      <View style={styles.legalContainer}>
        <Text style={styles.legalText}>
          By continuing, you agree to our{' '}
          <Text style={styles.linkText}>Terms of Use</Text>
          {' '}and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSection: {
    paddingBottom: Platform.OS === 'ios' ? 24 : 32,
  },
  continueButtonContainer: {
    marginBottom: 24,
  },
  continueButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  restoreButton: {
    alignItems: 'center',
    padding: 12,
    marginBottom: 24,
  },
  restoreButtonText: {
    fontSize: 16,
    color: '#4A67FF',
    fontWeight: '500',
  },
  legalContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  legalText: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
  },
  linkText: {
    color: '#4A67FF',
    textDecorationLine: 'underline',
  },
});

export default BottomSection;
