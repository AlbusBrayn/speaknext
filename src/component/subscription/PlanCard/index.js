import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PlanCard = ({ plan, selected, onSelect }) => {
  const isSelected = selected === plan.id;

  return (
    <TouchableOpacity
      style={[styles.planCard, isSelected && styles.selectedPlanCard]}
      onPress={() => onSelect(plan.id)}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>{plan.title}</Text>
        <Text style={styles.planPrice}>{plan.price}</Text>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Selection Indicator */}
      <View style={[styles.selectionIndicator, isSelected && styles.selectedIndicator]}>
        {isSelected && <View style={styles.selectedDot} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    marginBottom: 16,
  },
  selectedPlanCard: {
    borderColor: '#4A67FF',
    backgroundColor: '#242424',
  },
  planHeader: {
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A67FF',
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#4A67FF',
    marginRight: 8,
    fontWeight: '600',
  },
  featureText: {
    fontSize: 16,
    color: '#B0B0B0',
    flex: 1,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A4A4A',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    borderColor: '#4A67FF',
    backgroundColor: '#4A67FF',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});

export default PlanCard;
