import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const LEVELS = [
  {
    value: "Beginner",
    title: "Beginner",
    description: "Start from basics and build steady speaking confidence.",
  },
  {
    value: "Intermediate",
    title: "Intermediate",
    description: "Practice everyday topics and improve fluency and accuracy.",
  },
  {
    value: "Advanced",
    title: "Advanced",
    description: "Handle complex topics with nuance, speed, and clarity.",
  },
];

const LevelSelectScreen = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState("Beginner");

  const handleSelect = (value) => {
    setSelectedLevel(value);
    navigation.navigate("MainTabs", { screen: "Home" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E2E" />
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.title}>Choose your level</Text>
        <Text style={styles.subtitle}>
          Pick the journey that fits your current speaking comfort.
        </Text>
      </View>

      <View style={styles.options}>
        {LEVELS.map((level) => {
          const isSelected = selectedLevel === level.value;
          return (
            <Pressable
              key={level.value}
              onPress={() => handleSelect(level.value)}
              style={({ pressed }) => [
                styles.card,
                isSelected && styles.cardSelected,
                pressed && { opacity: 0.9 },
              ]}
            >
              <View style={styles.cardText}>
                <Text
                  style={[
                    styles.cardTitle,
                    isSelected && styles.cardTitleSelected,
                  ]}
                >
                  {level.title}
                </Text>
                <Text style={styles.cardDescription}>{level.description}</Text>
              </View>
              <View style={[styles.check, isSelected && styles.checkSelected]}>
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color="#1E1E2E" />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E2E",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 10,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 20,
  },
  options: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 14,
  },
  card: {
    backgroundColor: "#2C2C2E",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardSelected: {
    borderColor: "#4D6EF4",
    shadowColor: "#4D6EF4",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardText: {
    flex: 1,
    paddingRight: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  cardTitleSelected: {
    color: "#FFFFFF",
  },
  cardDescription: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 18,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
});

export default LevelSelectScreen;
