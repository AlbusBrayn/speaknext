import React from 'react';
import { Text, StyleSheet, Linking, View } from 'react-native';

const TermsText = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.termsText}>
        By continuing, you agree to our{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://example.com/terms')}
        >
          Terms of Use
        </Text>{' '}
        and{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://example.com/privacy')}
        >
          Privacy Policy
        </Text>
        .
      </Text>
    </View>
  );
};

export default TermsText;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#4C8EF7',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
