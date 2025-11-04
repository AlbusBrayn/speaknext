import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';

const ReferralOption = ({ option, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[
        styles.referralOption,
        {
          backgroundColor: isSelected ? '#4C8EF7' : '#222',
          borderColor: isSelected ? '#4C8EF7' : '#555',
        },
      ]}
      onPress={() => onSelect(option.value)}
    >
      <View style={styles.referralOptionContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.optionIcon}>{option.icon}</Text>
        </View>
        <Text
          style={[
            styles.optionTitle,
            { color: isSelected ? '#fff' : '#eee' },
          ]}
        >
          {option.title}
        </Text>
      </View>
      <View
        style={[
          styles.radioButton,
          {
            borderColor: isSelected ? '#fff' : '#555',
            backgroundColor: isSelected ? '#fff' : 'transparent',
          },
        ]}
      >
        {isSelected && <View style={styles.radioButtonInner} />}
      </View>
    </TouchableOpacity>
  );
};

export default ReferralOption;

const styles = StyleSheet.create({
  referralOption: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 72,
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
  referralOptionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionIcon: {
    fontSize: 20,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
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
