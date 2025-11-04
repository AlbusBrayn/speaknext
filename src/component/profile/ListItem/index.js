import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ListItem = ({ item }) => {
  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={item.onPress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      accessible={true}
    >
      <View style={styles.listItemContent}>
        <View style={styles.listItemLeft}>
          <Text style={styles.listItemIcon}>{item.icon}</Text>
          <Text
            style={[
              styles.listItemTitle,
              { color: item.destructive ? '#FF3B30' : '#000000' }, // kırmızı -> destructive
            ]}
          >
            {item.title}
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '300',
    color: '#888888',
  },
});

export default ListItem;
