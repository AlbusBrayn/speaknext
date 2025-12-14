// src/screens/SubscriptionScreen/index.js

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, SafeAreaView, StyleSheet, Text } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { fetchOfferings } from '../../utils/revenueCat';

const SubscriptionScreen_v2 = ({ navigation }) => {
  const [monthlyOffering, setMonthlyOffering] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOfferings = async () => {
      try {
        const offerings = await fetchOfferings(); // Purchases.getOfferings() wrapper’ı
        console.log('RC offerings:', JSON.stringify(offerings, null, 2));

        // 🔹 Sadece "Monthly" offering'ini hedefliyoruz
        const monthly = offerings.all?.Monthly;
        setMonthlyOffering(monthly || null);
      } catch (e) {
        console.log('Error fetching offerings', e);
      } finally {
        setLoading(false);
      }
    };

    loadOfferings();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!monthlyOffering) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: '#fff' }}>
          Monthly offering bulunamadı. RC dashboard’daki ID tam "Monthly" mi kontrol et.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 RevenueCat Paywall - sadece Monthly offering için */}
      <RevenueCatUI.Paywall
        options={{
          offering: monthlyOffering,
        }}
        onRestoreCompleted={({ customerInfo }) => {
          // İstersen entitlement kontrolü yaparsın:
          // if (customerInfo.entitlements.active["pro_access"]) { ... }
          console.log('Restore completed', customerInfo);
        }}
        onDismiss={() => {
          // Kullanıcı X'e bastı veya başarılı purchase sonrası çağrılır.
          // Check if we can go back before attempting to navigate
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
          // If there's no screen to go back to, do nothing
          // (This happens when SubscriptionNavigator is the root navigator)
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Senin theme’e göre
  },
});

export default SubscriptionScreen_v2;
