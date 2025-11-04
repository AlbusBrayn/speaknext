import React from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoCircle}>
        <Image
          source={require('../../../../assets/speakify-logo.jpg')}
          style={styles.logoImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
  },
});
