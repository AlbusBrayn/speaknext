import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../../../utils/Theme';

const ProgressBar = ({
  progress,
  height = 4,
  trackColor = colors.border,
  progressColor = colors.primary,
  style,
}) => {
  return (
    <View style={[styles.container, { height }, style]}>
      <View style={[styles.track, { backgroundColor: trackColor }]} />
      <View
        style={[
          styles.progress,
          {
            backgroundColor: progressColor,
            width: `${Math.min(Math.max(progress, 0), 100)}%`,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 2,
    overflow: 'hidden',
  },
  track: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 2,
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 2,
  },
});

export default ProgressBar;
