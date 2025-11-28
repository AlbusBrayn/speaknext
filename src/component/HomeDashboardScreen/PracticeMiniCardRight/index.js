import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';


const PracticeMiniCardRight = ({ title = "Pronunciation Practice", status = "in_progress", icon, onPress 
}) => {
  const disabled = status !== "in_progress";
  
  // Format status for display
  const statusLabel = status === "locked" 
    ? "Locked 🔒" 
    : status === "completed" 
    ? "Completed ✅" 
    : "In Progress";

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
      {icon && <Image source={icon} style={[styles.icon, disabled && { opacity: 0.5 }]} />}
      <View style={styles.textContainer}>
        <Text style={[styles.status, disabled && styles.statusDisabled]}>{statusLabel}</Text>
        <Text style={[styles.title, disabled && styles.titleDisabled]}>{title}</Text>
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
  statusDisabled: {
    color: '#A1A1AA',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  titleDisabled: {
    color: '#A1A1AA',
  },
});

export default PracticeMiniCardRight;
