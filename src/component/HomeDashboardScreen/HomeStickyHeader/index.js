import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HomeStickyHeader = ({
  userName = "Student",
  dayLabel = "Day -",
  topic = "-",
  levelLabel = "Beginner",
  onPressLevel,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Welcome {userName}</Text>
          <Text style={styles.subGreeting}>Continue Your Speaking Journey</Text>
        </View>
        <Pressable onPress={onPressLevel} style={styles.levelButton}>
          <Text style={styles.levelLabel}>Level</Text>
          <View style={styles.levelValueRow}>
            <Text style={styles.levelValue}>{levelLabel}</Text>
            <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
          </View>
        </Pressable>
      </View>
      <View style={styles.unitPill}>
        <View style={styles.unitText}>
          <Text style={styles.dayText}>{dayLabel}</Text>
          <Text style={styles.topicText} numberOfLines={1}>
            {topic}
          </Text>
        </View>
        <View style={styles.unitDivider} />
        <View style={styles.unitIcon}>
          <Ionicons name="book-outline" size={18} color="#C15CFF" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#1E1E2E",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    flex: 1,
  },
  subGreeting: {
    marginTop: 4,
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  dayText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 4,
  },
  topicText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  levelButton: {
    backgroundColor: "#2C2C2E",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  levelLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 2,
  },
  levelValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    marginRight: 6,
  },
  unitPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  unitText: {
    flex: 1,
    paddingRight: 12,
  },
  unitDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,0.12)",
    marginRight: 12,
  },
  unitIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeStickyHeader;
