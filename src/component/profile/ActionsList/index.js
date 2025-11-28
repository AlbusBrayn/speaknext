import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../../utils/Theme';
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
    marginHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
    ...shadows.small,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 52,
    backgroundColor: colors.separator,
  },
});

export default ActionsList;
