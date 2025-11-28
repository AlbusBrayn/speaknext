import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../../utils/Theme';

const ResultCategoryCard = ({ category, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.header}>
      <View style={styles.iconContainer}>
        <Ionicons name={category.icon} size={20} color={category.color} />
      </View>
      <Text style={styles.title}>{category.title}</Text>
    </View>

    <Text style={[styles.score, { color: category.color }]}>
      {category.score}
    </Text>

    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${category.progress}%`, backgroundColor: category.color }]} />
    </View>

    <Text style={styles.description}>{category.description}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '47%',
    minHeight: 180,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  iconContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  title: { ...typography.bodyBold, color: colors.textPrimary },
  score: { fontSize: 32, fontWeight: '700', marginBottom: spacing.md },
  progressTrack: { height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden', marginBottom: spacing.md },
  progressFill: { height: '100%', borderRadius: 2 },
  description: { ...typography.caption, color: colors.textSecondary, lineHeight: 16 },
});

export default ResultCategoryCard;
