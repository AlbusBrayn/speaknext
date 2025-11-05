import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logoutThisDevice } from '../../api/bac/authservice'; // 🔹 logout fonksiyonunu import ettik

import ProfileHeader from '../../component/profile/ProfileHeader';
import PremiumCard from '../../component/profile/PremiumCard';
import ActionsList from '../../component/profile/ActionsList';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutThisDevice(); // 🔹 backend + SecureStore temizliği
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }], // 🔹 login sayfasına dön
              });
            } catch (err) {
              console.log('Logout error:', err);
              Alert.alert('Error', 'Something went wrong while logging out.');
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
      title: 'Log Out',
      icon: '🚪',
      destructive: true,
      onPress: handleLogout, // 🔹 logout fonksiyonunu bağladık
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ProfileHeader user={user} />
        <PremiumCard onUpgrade={() => console.log('Upgrade pressed')} />
        <ActionsList items={actionItems} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#000' },
});

export default ProfileScreen;
