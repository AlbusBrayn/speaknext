import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GreetingHeader = ({ userName = "John" }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>Welcome {userName}</Text>
      <Text style={styles.subGreeting}>Continue Your Speaking Journey</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#B0B0B0',
  },
});

export default GreetingHeader;
