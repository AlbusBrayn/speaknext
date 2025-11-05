import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ progress = 0, label }) => {
  const pct = Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  label: {
    color: '#C7C9D1',
    fontSize: 13,
    marginBottom: 6,
  },
  barBackground: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#4D6EF4',
    borderRadius: 4,
  },
});

export default ProgressBar;
