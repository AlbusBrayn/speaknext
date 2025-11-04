import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HeaderSection = () => {
  return (
    <View style={styles.headerSection}>
      <Text style={styles.title}>
        First, what should we call you?
      </Text>
      <Text style={styles.subtitle}>
        Enter your name to personalize your experience
      </Text>
    </View>
  );
};

export default HeaderSection;

const styles = StyleSheet.create({
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 8,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    color: '#ccc',
  },
});
