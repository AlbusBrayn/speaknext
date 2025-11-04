import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HeaderSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please choose your English level</Text>
      <Text style={styles.subtitle}>
        This helps us customize your learning experience
      </Text>
    </View>
  );
};

export default HeaderSection;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 12,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    color: '#ccc',
  },
});
