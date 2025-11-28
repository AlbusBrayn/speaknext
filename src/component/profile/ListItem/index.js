import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../utils/Theme';

const ListItem = ({ item }) => {
  const isDisabled = item.disabled;

  return (
    <TouchableOpacity
      style={[styles.listItem, isDisabled && styles.listItemDisabled]}
      onPress={isDisabled ? undefined : item.onPress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      accessible={true}
      disabled={isDisabled}
    >
      <View style={styles.listItemContent}>
        <View style={styles.listItemLeft}>
          <Text style={styles.listItemIcon}>{item.icon}</Text>
          <Text
            style={[
              styles.listItemTitle,
              item.destructive && styles.destructiveText,
              isDisabled && styles.disabledText,
            ]}
          >
            {item.title}
          </Text>
        </View>
        <Text
          style={[
            styles.chevron,
            item.destructive && styles.destructiveChevron,
            isDisabled && styles.disabledChevron,
          ]}
        >
          ›
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.cardBackground,
  },
  listItemDisabled: {
    opacity: 0.6,
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
    marginRight: spacing.md,
    width: 24,
    textAlign: 'center',
  },
  listItemTitle: {
    ...typography.bodyBold,
    flex: 1,
    color: colors.textPrimary,
  },
  destructiveText: {
    color: '#FF3B30', // iOS system red
  },
  disabledText: {
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '300',
    color: colors.textSecondary,
  },
  destructiveChevron: {
    color: '#FF3B30',
  },
  disabledChevron: {
    color: colors.textSecondary,
  },
});

export default ListItem;

