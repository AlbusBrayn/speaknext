import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const GoogleButton = ({ onPress, isLoading }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={isLoading}
    >
      <View style={styles.content}>
        <AntDesign name="google" size={20} color="#4285F4" style={styles.icon} />
        <Text style={styles.text}>Continue with Google</Text>
        {isLoading && <ActivityIndicator size="small" color="#000" style={styles.loader} />}
      </View>
    </TouchableOpacity>
  );
};

export default GoogleButton;

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: '#fff',
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2, // Android gölge
    shadowColor: '#000', // iOS gölge
    shadowOpacity: 0.1,
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
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  loader: {
    marginLeft: 8,
  },
});
