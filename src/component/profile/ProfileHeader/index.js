import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../../utils/Theme';

const ProfileHeader = ({ user }) => {
  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        {user.avatarUrl ? (
          <Image
            source={{ uri: user.avatarUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.xxl,
  },
  avatarContainer: {
    marginBottom: spacing.md,
    ...shadows.medium,
    borderRadius: borderRadius.full,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.title2,
    color: colors.textPrimary,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    ...typography.title3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.callout,
    color: colors.textSecondary,
  },
});

export default ProfileHeader;
