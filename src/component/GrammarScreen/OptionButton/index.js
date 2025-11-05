import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const OptionButton = ({
  text,
  onPress,
  selected = false,
  disabled = false,
  intent = 'neutral', // 'neutral' | 'selected' | 'correct' | 'wrong'
}) => {
  const styleByIntent = {
    neutral: styles.neutral,
    selected: styles.selected,
    correct: styles.correct,
    wrong: styles.wrong,
  }[intent] || styles.neutral;

  return (
    <TouchableOpacity
      style={[styles.button, styleByIntent, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          (selected || intent === 'selected' || intent === 'correct') && styles.textStrong,
          disabled && styles.disabledText,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  neutral: { backgroundColor: '#2C2C2E', borderColor: 'rgba(255,255,255,0.1)' },
  selected: { backgroundColor: '#3B3C4E', borderColor: '#4D6EF4' },
  correct:  { backgroundColor: '#1F3D2A', borderColor: '#22C55E' },
  wrong:    { backgroundColor: '#3D1F23', borderColor: '#EF4444' },

  disabledButton: { opacity: 0.9 },
  text: { fontSize: 16, color: '#fff', textAlign: 'center' },
  textStrong: { fontWeight: '700' },
  disabledText: { color: '#8b8b8b' },
});

export default OptionButton;
