import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius } from '../../../../utils/Theme';

const OutlinedButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  size = 'medium',
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.base,
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const renderContent = () => {
    if (loading) {
      return <Text style={textStyles}>Loading...</Text>;
    }

    if (icon) {
      return (
        <View style={styles.contentContainer}>
          {iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
              color={colors.primary}
              style={styles.iconLeft}
            />
          )}
          <Text style={textStyles}>{title}</Text>
          {iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
              color={colors.primary}
              style={styles.iconRight}
            />
          )}
        </View>
      );
    }

    return <Text style={textStyles}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={disabled || loading ? undefined : onPress}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },

  // Sizes
  small: {
    height: 40,
    paddingHorizontal: 16,
  },
  medium: {
    height: 48,
    paddingHorizontal: 20,
  },
  large: {
    height: 56,
    paddingHorizontal: 24,
  },

  // States
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },

  // Content
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },

  // Text styles
  text: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: typography.callout.fontSize,
  },
  mediumText: {
    fontSize: typography.body.fontSize,
  },
  largeText: {
    fontSize: typography.headline.fontSize,
  },
  disabledText: {
    opacity: 0.7,
  },
});

export default OutlinedButton;

