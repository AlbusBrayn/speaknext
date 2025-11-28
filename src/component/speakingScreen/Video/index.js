import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../../utils/Theme';
import VideoCard from './VideoCard';

const SpeakingVideo = ({ videoSource, imageSource, onPress }) => (
  <View style={styles.videoSection}>
    <VideoCard
      videoSource={videoSource}
      imageSource={imageSource}
      showVideo={true}
      title="Listen Carefully"
      subtitle="Ensure you are in a quiet environment..."
      onPress={onPress}
      style={styles.videoCard}
    />
  </View>
);

const styles = StyleSheet.create({
  videoSection: { marginBottom: spacing.xxxl },
  videoCard: { marginHorizontal: 0 },
});

export default SpeakingVideo;
