import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const AppleButton = ({ onPress, isLoading }) => {
  // Sadece iOS'ta göster → istersen kaldırabilirsin
  if (Platform.OS !== 'ios') return null;

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={isLoading}
    >
      <View style={styles.content}>
        <AntDesign name="apple" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.text}>Continue with Apple</Text>
        {isLoading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
      </View>
    </TouchableOpacity>
  );
};

export default AppleButton;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: '#000',
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#333',
    elevation: 2, // Android
    shadowColor: '#000', // iOS
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loader: {
    marginLeft: 8,
  },
});
