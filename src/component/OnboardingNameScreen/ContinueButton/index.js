import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

const ContinueButton = ({ disabled, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.continueButton,
        { backgroundColor: disabled ? '#555' : '#4C8EF7', opacity: disabled ? 0.6 : 1 }
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.continueButtonText, { color: disabled ? '#999' : '#fff' }]}>
        Continue
      </Text>
    </TouchableOpacity>
  );
};

export default ContinueButton;

const styles = StyleSheet.create({
  continueButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
