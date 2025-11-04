import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

const ContinueButton = ({ disabled, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? '#444' : '#4C8EF7',
          opacity: disabled ? 0.6 : 1,
        }
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.text,
        { color: disabled ? '#aaa' : '#fff' }
      ]}>
        Continue
      </Text>
    </TouchableOpacity>
  );
};

export default ContinueButton;

const styles = StyleSheet.create({
  button: {
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
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
