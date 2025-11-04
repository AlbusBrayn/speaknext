import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';

const LevelOption = ({ level, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[
        styles.levelOption,
        {
          backgroundColor: isSelected ? '#4C8EF7' : '#1c1c1e',
          borderColor: isSelected ? '#4C8EF7' : '#333',
        }
      ]}
      onPress={() => onSelect(level.value)}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.levelTitle, { color: isSelected ? '#fff' : '#fff' }]}>
          {level.title}
        </Text>
        <Text style={[styles.levelDescription, { color: isSelected ? '#fff' : '#aaa' }]}>
          {level.description}
        </Text>
      </View>
      <View style={[
        styles.radioButton,
        {
          borderColor: isSelected ? '#fff' : '#666',
          backgroundColor: isSelected ? '#fff' : 'transparent',
        }
      ]}>
        {isSelected && <View style={styles.radioButtonInner} />}
      </View>
    </TouchableOpacity>
  );
};

export default LevelOption;

const styles = StyleSheet.create({
  levelOption: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 80,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4C8EF7',
  },
});
