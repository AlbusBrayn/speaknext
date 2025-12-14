import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import Header from "../../component/subscription/Header";
import PlanCard from "../../component/subscription/PlanCard";
import BottomSection from "../../component/subscription/BottomSection";
import { useQueryClient } from "@tanstack/react-query";
import { fetchOfferings } from "../../utils/revenueCat";
import { L } from "../../utils/logger";

const SubscriptionScreen_v2 = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [rcPlans, setRcPlans] = useState(null); // 🔹 RC’den gelen planlar
  const qc = useQueryClient();

  // Şimdilik fallback olarak duran hard-coded planlar (gerekirse)
  const fallbackPlans = [
    {
      id: "monthly",
      title: "Monthly Plan",
      price: "$9.99",
      features: [
        "Unlock all speaking modules",
        "AI-powered feedback analysis",
        "Practice with daily speaking missions",
      ],
    },
  ];

  // 🔹 RevenueCat offerings test
  /*   useEffect(() => {
    const loadOfferings = async () => {
      try {
        const offerings = await fetchOfferings();
        L.sub('RC offerings:', JSON.stringify(offerings, null, 2));

        // Sadece current offering ve içindeki ilk product’ı alalım
        if (offerings.current && offerings.current.availablePackages.length > 0) {
          const pkg = offerings.current.availablePackages[0];
          // pkg.storeProduct: Apple tarafındaki product bilgisi
          const uiPlan = {
            id: pkg.identifier,                               // örn: rc_999_1m
            title: pkg.storeProduct.description || 'Monthly',
            price: pkg.storeProduct.priceString,              // örn: "$9.99"
            features: [
              'Unlock all speaking modules',
              'AI-powered feedback analysis',
              'Daily speaking missions',
            ],
          };
          setRcPlans([uiPlan]);
        } else {
          L.sub('No current offering found, using fallback plans.');
        }
      } catch (e) {
        console.log('Error fetching offerings', e);
        Alert.alert('RevenueCat', 'Offerings could not be loaded.');
      }
    };

    loadOfferings();
  }, []); */

  /*   useEffect(() => {
    const loadOfferings = async () => {
      try {
        const offerings = await fetchOfferings();
        // L.sub('RC offerings:', JSON.stringify(offerings, null, 2));
        console.log('RC offerings:', JSON.stringify(offerings, null, 2));

        // L.sub('RC offerings:', JSON.stringify(offerings, null, 2));
  
        // 1) Önce current offering'i kullanmayı dene
        let offering = offerings.current;
  
        // 2) current yoksa, all içinden ilk offering'i al
        if (!offering) {
          const allOfferings = Object.values(offerings.all || {});
          if (allOfferings.length > 0) {
            offering = allOfferings[0];
            console.log('first offering:', offering);
            console.log('--------------------------------');
            console.log('offering.identifier:', offering.identifier);
            // L.sub(
            //   'Using first offering from offerings.all:',
            //   offering.identifier
            // );
          }
        }
  
        // 3) Offering bulunduysa tüm paketleri UI'a çevir
        if (offering && offering.availablePackages.length > 0) {
          const uiPlans = offering.availablePackages.map((pkg) => {
            const sp = pkg.product || pkg.storeProduct || {};
  
            return {
              id: pkg.identifier, // örn: "$rc_weekly" veya "$rc_monthly"
              title: sp.title || sp.localizedTitle || 'Subscription',
              price: sp.priceString, // örn: "$2.99"
              features: [
                'Unlock all speaking modules',
                'AI-powered feedback analysis',
                'Daily speaking missions',
              ],
            };
          });
  
          setRcPlans(uiPlans);
        } else {
          L.sub(
            'No offering with availablePackages found, using fallback plans.'
          );
        }
      } catch (e) {
        console.log('Error fetching offerings', e);
        Alert.alert('RevenueCat', 'Offerings could not be loaded.');
      }
    };
  
    loadOfferings();
  }, []); */

  useEffect(() => {
    const loadOfferings = async () => {
      try {
        const offerings = await fetchOfferings();
        console.log("RC offerings:", JSON.stringify(offerings, null, 2));

        // 🔹 1) Sadece "Monthly" offering'ini hedefliyoruz
        const monthlyOffering = offerings.all?.Monthly; // ID tam olarak "Monthly"

        if (!monthlyOffering) {
          console.log("Monthly offering not found, using fallback plans.");
          return;
        }

        if (!monthlyOffering.availablePackages?.length) {
          console.log(
            "Monthly offering has no availablePackages, using fallback plans."
          );
          return;
        }

        // 🔹 2) Monthly offering içindeki ilk paketi al (genelde tek olur)
        const pkg = monthlyOffering.availablePackages[0];
        const sp = pkg.product || pkg.storeProduct || {};

        const uiPlan = {
          id: pkg.identifier, // "$rc_monthly"
          rcProductId: sp.identifier, // "rc_999_1m"
          title: sp.title || "Monthly Plan",
          price: sp.priceString, // "$9.99"
          interval: sp.subscriptionPeriod, // "P1M"
          type: pkg.packageType, // "MONTHLY"
          features: [
            "Unlock all speaking modules",
            "AI-powered feedback analysis",
            "Daily speaking missions",
          ],
        };

        setRcPlans([uiPlan]); // 🔹 Sadece monthly planı göster
      } catch (e) {
        console.log("Error fetching offerings", e);
        Alert.alert("RevenueCat", "Offerings could not be loaded.");
      }
    };

    loadOfferings();
  }, []);

  const plans = rcPlans || fallbackPlans; // RC çalışmazsa fallback kullan

  const handleContinue = async () => {
    if (!selectedPlan) return;
    console.log("Selected plan:", selectedPlan);

    // Şimdilik YALNIZCA optimistic status (backend yok)
    qc.setQueryData(["status"], (old) => {
      const next = { ...(old || {}) };
      next.is_subscription_active = true;
      next.plan = selectedPlan.id || selectedPlan;
      return next;
    });
  };

  const handleRestorePurchase = () => {
    console.log("Restore purchase triggered (RC tarafını sonra bağlarız)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header title="Choose Your Plan" onBack={() => navigation.goBack()} />

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan}
              onSelect={setSelectedPlan}
            />
          ))}
        </View>

        <BottomSection
          onContinue={handleContinue}
          onRestore={handleRestorePurchase}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  plansContainer: {
    marginBottom: 32,
  },
});

export default SubscriptionScreen_v2;
