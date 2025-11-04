import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';


const PracticeMiniCardRight = ({ title = "Pronunciation Practice", status = "Completed", icon,   onPress 
}) => {
  const disabled = status === "locked";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        pressed && !disabled && { opacity: 0.8 },
        disabled && { opacity: 0.5 },
      ]}
      android_ripple={{ color: 'rgba(255,255,255,0.08)', borderless: false }}
    >
      {icon && <Image source={icon} style={styles.icon} />}
      <View style={styles.textContainer}>
        <Text style={styles.status}>{status}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderWidth: 1.1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 12,
    width: 220,
    alignSelf: 'flex-end', // sağa yaslı
    marginRight: 40, // biraz içeriden gelsin
    marginVertical: 8,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  status: {
    color: '#4ADE80',
    fontSize: 13,
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PracticeMiniCardRight;
