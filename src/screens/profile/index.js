import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { deleteAccount } from '../../api/bac/authservice';
import { useUser } from '../../contexts/UserContext';
import { colors, spacing, typography } from '../../utils/Theme';

import ProfileHeader from '../../component/profile/ProfileHeader';
import PremiumCard from '../../component/profile/PremiumCard';
import ActionsList from '../../component/profile/ActionsList';

const ProfileScreen = () => {
  const { signOut } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await signOut();
              // Root navigator will automatically switch to AuthNavigator
              // when accessToken becomes null
            } catch (err) {
              console.log('Logout error:', err);
              Alert.alert('Error', 'Something went wrong while logging out.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action will permanently delete your account and all associated data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteAccount();
              // Clear auth state - root navigator will automatically switch to AuthNavigator
              await signOut();
              Alert.alert(
                'Account Deleted',
                'Your account has been deleted successfully.',
                [{ text: 'OK' }],
                { cancelable: false }
              );
            } catch (err) {
              console.log('Delete account error:', err);
              Alert.alert(
                'Error',
                'We could not delete your account. Please check your connection and try again.'
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: null,
  };

  const actionItems = [
    {
      id: 'subscription',
      title: 'Manage Subscription',
      icon: '💳',
      onPress: () => console.log('Manage Subscription'),
    },
    {
      id: 'whatsapp',
      title: 'Contact Us via WhatsApp',
      icon: '💬',
      onPress: () => console.log('Contact WhatsApp'),
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      icon: '📋',
      onPress: () => console.log('Navigate to Terms'),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: '🔒',
      onPress: () => console.log('Navigate to Privacy'),
    },
    {
      id: 'logout',
      title: isLoggingOut ? 'Logging out...' : 'Log Out',
      icon: '🚪',
      destructive: true,
      disabled: isLoggingOut || isDeleting,
      onPress: handleLogout,
    },
    {
      id: 'delete',
      title: isDeleting ? 'Deleting account...' : 'Delete Account',
      icon: '🗑️',
      destructive: true,
      disabled: isLoggingOut || isDeleting,
      onPress: handleDeleteAccount,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>
            Manage your account, subscription and preferences.
          </Text>
        </View>

        <ProfileHeader user={user} />
        <PremiumCard onUpgrade={() => console.log('Upgrade pressed')} />
        <ActionsList items={actionItems} />

        {(isLoggingOut || isDeleting) && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <ActivityIndicator color={colors.textPrimary} />
            <Text style={styles.loadingText}>
              {isDeleting ? 'Deleting your account…' : 'Logging you out…'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.huge,
  },
  header: {
    paddingHorizontal: spacing.xxl,
    paddingTop: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.title1,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.body,
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  loadingOverlay: {
    marginTop: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.callout,
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
});

export default ProfileScreen;
