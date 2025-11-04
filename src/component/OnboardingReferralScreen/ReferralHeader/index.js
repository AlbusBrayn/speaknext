import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReferralHeader = () => {
  return (
    <View style={styles.headerSection}>
      <Text style={styles.title}>How did you hear about this app?</Text>
      <Text style={styles.subtitle}>
        Help us understand how you discovered us
      </Text>
    </View>
  );
};

export default ReferralHeader;

const styles = StyleSheet.create({
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 34,
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
