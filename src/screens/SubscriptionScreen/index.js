import React, { useCallback, useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, ActivityIndicator, Text, Button } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../contexts/UserContext';
import { L } from '../../utils/logger';
import {
  configureRevenueCat,
  identifyRevenueCatUser,
  REVENUECAT_ENABLED,
  REVENUECAT_ENTITLEMENT_ID,
} from '../../lib/revenuecat';

const SubscriptionScreen = ({ navigation }) => {
  const qc = useQueryClient();
  const { user } = useUser();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    configureRevenueCat(user?.id);
    identifyRevenueCatUser(user?.id);
    setReady(true);
  }, [user?.id]);

  const syncStatusFromCustomerInfo = useCallback(
    (customerInfo) => {
      const entitlement = customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT_ID];
      const isActive = !!entitlement;
      const plan = entitlement?.productIdentifier || null;

      qc.setQueryData(['status'], (old) => {
        const next = { ...(old || {}) };
        next.is_subscription_active = isActive;
        if (plan) next.plan = plan;
        return next;
      });

      if (isActive) {
        navigation.goBack();
      }
    },
    [navigation, qc]
  );

  const handlePurchaseCompleted = ({ customerInfo }) => {
    syncStatusFromCustomerInfo(customerInfo);
  };

  const handleRestoreCompleted = ({ customerInfo }) => {
    syncStatusFromCustomerInfo(customerInfo);
  };

  const handlePurchaseError = (error) => {
    L.err('RevenueCat purchase error', error?.message || error);
  };

  const handleRestoreError = (error) => {
    L.err('RevenueCat restore error', error?.message || error);
  };

  const handleDismiss = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  if (!ready) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color="#fff" style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!REVENUECAT_ENABLED) {
    const canGoBack = navigation.canGoBack();
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.disabledWrapper}>
          <Text style={styles.disabledTitle}>Subscriptions disabled</Text>
          <Text style={styles.disabledText}>
            RevenueCat is turned off for test mode.
          </Text>
          {canGoBack && <Button title="Back" onPress={() => navigation.goBack()} />}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paywallWrapper}>
        <RevenueCatUI.Paywall
          onPurchaseCompleted={handlePurchaseCompleted}
          onRestoreCompleted={handleRestoreCompleted}
          onPurchaseError={handlePurchaseError}
          onRestoreError={handleRestoreError}
          onDismiss={handleDismiss}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  loader: {
    flex: 1,
  },
  paywallWrapper: {
    flex: 1,
  },
  disabledWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  disabledTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
  },
  disabledText: {
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default SubscriptionScreen;
