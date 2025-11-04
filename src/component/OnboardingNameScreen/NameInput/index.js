import React from 'react';
import { TextInput, StyleSheet, Platform, View } from 'react-native';

const NameInput = ({ value, onChangeText, isFocused, setIsFocused, onSubmit }) => {
  return (
    <View style={styles.inputSection}>
      <TextInput
        style={[
          styles.textInput,
          { borderColor: isFocused ? '#4C8EF7' : '#555' }
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Your name"
        placeholderTextColor="#888"
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
    </View>
  );
};

export default NameInput;

const styles = StyleSheet.create({
  inputSection: {
    marginBottom: 24,
  },
  textInput: {
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '400',
    color: '#fff',
    backgroundColor: '#222',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});
