import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";

const BlankSplash = () => {
  return (
    <View style={styles.container}>
      {/* Uygulama Logosu (opsiyonel) */}
      <Image
          source={require('../../../assets/speakify-logo.jpg')}
          style={styles.logo}
        resizeMode="contain"
      />

      {/* Loading Spinner */}
      <ActivityIndicator size="large" color="#4A67FF" style={styles.spinner} />

      {/* İsteğe bağlı yazı */}
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

export default BlankSplash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Dark mode için siyah, istersen beyaz yap
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  spinner: {
    marginVertical: 10,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff", // Siyah arka plan için beyaz yazı
  },
});
