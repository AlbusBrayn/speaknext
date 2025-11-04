import React from 'react';
import { View, StyleSheet } from 'react-native';
import ListItem from '../ListItem';

const ActionsList = ({ items }) => {
  return (
    <View style={styles.actionsContainer}>
      {items.map((item, index) => (
        <View key={item.id}>
          <ListItem item={item} />
          {index < items.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 1, // Android gölge
    shadowColor: '#000', // iOS gölge
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  separator: {
    height: 0.5,
    marginLeft: 52, // icon hizasından başlasın
    backgroundColor: '#E0E0E0',
  },
});

export default ActionsList;
