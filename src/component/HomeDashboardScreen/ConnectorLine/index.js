import React from 'react';
import { View, StyleSheet } from 'react-native';

const ConnectorLine = ({ height = 36, topMargin = 0 }) => {
  return (
    <View style={[styles.line, { height, marginTop: topMargin }]} />
  );
};

const styles = StyleSheet.create({
  line: {
    width: 5,
    backgroundColor: '#2C2C2E',
    borderWidth: 1.13,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    alignSelf: 'center',
  },
});

export default ConnectorLine;
