import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Header from '../../component/subscription/Header';
import PlanCard from '../../component/subscription/PlanCard';
import BottomSection from '../../component/subscription/BottomSection';
import { useUser } from '../../contexts/UserContext'; // ✅ ekle
import { useQueryClient } from '@tanstack/react-query';
import { L } from '../../utils/logger';


const SubscriptionScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const qc = useQueryClient();


  const plans = [
    {
      id: 'weekly',
      title: 'Weekly Plan',
      price: '$2.99',
      features: [
        'Unlock all speaking modules',
        'AI-powered feedback analysis',
        'Practice with daily speaking missions'
      ]
    },
    {
      id: 'monthly',
      title: 'Monthly Plan',
      price: '$9.99',
      features: [
        'Everything in Weekly Plan',
        'Track your progress & get performance stats',
        'Personalized learning tips'
      ]
    }
  ];
  const handleContinue = async () => {
    if (!selectedPlan) return;
    console.log('Selected plan:', selectedPlan);
  
    // 1) Optimistic: aboneliği aktif yap
    qc.setQueryData(['status'], (old) => {
      const next = { ...(old || {}) };
      next.is_subscription_active = true;  // 🔑 Root Main'e geçer
      next.plan = selectedPlan;
      return next;
    });
  };
  

    
  


  const handleRestorePurchase = () => {
    console.log('Restore purchase triggered');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header 
          title="Choose Your Plan" 
          onBack={() => navigation.goBack()} 
        />

        {/* Plan Cards */}
        <View style={styles.plansContainer}>
          {plans.map(plan => (
            <PlanCard 
              key={plan.id}
              plan={plan}
              selected={selectedPlan}
              onSelect={setSelectedPlan}
            />
          ))}
        </View>

        {/* Bottom Section */}
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
    backgroundColor: '#0F0F0F',
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

export default SubscriptionScreen;
