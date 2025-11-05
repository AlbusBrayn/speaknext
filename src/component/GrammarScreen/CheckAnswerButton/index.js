import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CheckAnswerButton = ({
  title = 'Check Answer',
  onPress,
  disabled = false,
  intent = 'primary', // 'neutral' | 'primary' | 'success' | 'danger'
}) => {
  const bg = {
    neutral: styles.neutral,
    primary: styles.primary,
    success: styles.success,
    danger: styles.danger,
  }[intent] || styles.primary;

  return (
    <TouchableOpacity
      style={[styles.button, bg, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  neutral: { backgroundColor: '#3B3C4E' },
  primary: { backgroundColor: '#4D6EF4' },
  success: { backgroundColor: '#22C55E' },
  danger:  { backgroundColor: '#EF4444' },

  disabledButton: { opacity: 0.5 },
  text: { fontSize: 18, fontWeight: '700', color: '#fff' },
});

export default CheckAnswerButton;
