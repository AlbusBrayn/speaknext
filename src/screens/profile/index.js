import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
} from 'react-native';

import ProfileHeader from '../../component/profile/ProfileHeader';
import PremiumCard from '../../component/profile/PremiumCard';
import ActionsList from '../../component/profile/ActionsList';

const ProfileScreen = () => {
  // Örnek user bilgisi (normalde Context veya API’den gelir)
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: null, // varsa profil resmi URL’si
  };

  // Eylem listesi
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
      title: 'Log Out',
      icon: '🚪',
      destructive: true,
      onPress: () => console.log('Logout'),
    },
    {
      id: 'delete',
      title: 'Delete Account',
      icon: '🗑️',
      destructive: true,
      onPress: () => console.log('Delete Account'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Premium Card */}
        <PremiumCard onUpgrade={() => console.log('Upgrade pressed')} />

        {/* Actions List */}
        <ActionsList items={actionItems} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // açık gri arka plan
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
});

export default ProfileScreen;
