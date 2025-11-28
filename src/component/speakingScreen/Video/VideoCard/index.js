import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video'; // ✅ expo-video
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, shadows } from '../../../../utils/Theme';

const VideoCard = ({
  videoSource,
  imageSource,
  title,
  subtitle,
  onPress,
  style,
  showVideo = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Create a player with expo-video
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
  });

  // Check if player is available
  useEffect(() => {
    if (player) {
      setVideoError(false);
    } else {
      setVideoError(true);
    }
  }, [player]);

  const handlePlayPress = () => {
    if (showVideo && player) {
      try {
        if (isPlaying) {
          player.pause();
          setIsPlaying(false);
        } else {
          player.play();
          setIsPlaying(true);
        }
      } catch (error) {
        setVideoError(true);
      }
    } else {
      onPress && onPress();
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handlePlayPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        {showVideo && videoSource && !videoError ? (
          <VideoView
            style={styles.video}
            player={player}
            contentFit="cover"
            allowsFullscreen={false}
            showsTimecodes={false}
          />
        ) : (
          imageSource && <Image source={imageSource} style={styles.image} />
        )}
        
        {videoError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Video could not be loaded</Text>
          </View>
        )}
        
        <View style={styles.overlay}>
          <View style={styles.playButton}>
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={24} 
              color={colors.textPrimary} 
            />
          </View>
        </View>
      </View>
      
      <View style={styles.captionContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    ...shadows.medium,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  captionContainer: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  title: {
    ...typography.headline,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default VideoCard;