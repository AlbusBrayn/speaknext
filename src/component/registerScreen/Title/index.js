import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Title = () => {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.title}>Welcome to Speakify</Text>
      <Text style={styles.subtitle}>
        Practice, improve, and master your speaking skills.
      </Text>
    </View>
  );
};

export default Title;

const styles = StyleSheet.create({
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 41,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    color: '#ccc',
  },
});
