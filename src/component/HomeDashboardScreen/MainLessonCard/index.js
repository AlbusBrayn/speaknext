import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const MainLessonCard = ({
  image,
  unit = "Unit 2 | Day 2.3.6",
  title = "IELTS Speaking Part 1",
  description = "Practice answering common introduction and interview-style questions.",
  buttonText = "Continue Learning",
  onPress,
}) => {
  return (
    <View style={styles.card}>
      {/* Üstteki Görsel */}
      {image && <Image source={image} style={styles.image} />}

      {/* Üst Bilgi */}
      <View style={styles.unitContainer}>
        <Text style={styles.unitText}>{unit}</Text>
      </View>

      {/* Başlık */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Açıklama */}
      <View style={styles.descContainer}>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Buton */}
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
        <Text style={styles.buttonIcon}>🚀</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 355,
    height: 393,
    backgroundColor: '#2C2C2E',
    borderWidth: 2.2,
    borderColor: '#FFFFFF',
    borderRadius: 34,
    padding: 20,
    marginVertical: 16,
    alignSelf: 'center',
  },
  image: {
    width: 311,
    height: 148,
    borderRadius: 18,
    marginBottom: 16,
    alignSelf: 'center',
  },
  unitContainer: {
    marginBottom: 8,
  },
  unitText: {
    color: '#A1A1AA',
    fontSize: 15,
  },
  titleContainer: {
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  descContainer: {
    marginBottom: 16,
  },
  description: {
    color: '#F3E8FF',
    fontSize: 15,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#4D6EF4',
    borderRadius: 18,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  buttonIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default MainLessonCard;
