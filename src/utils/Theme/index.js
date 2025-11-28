export const colors = {
    // Primary colors
    background: '#0F0F0F',
    cardBackground: '#1C1C1C',
    selectedCardBackground: '#242424',
    
    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#666666',
    
    // Accent colors
    primary: '#4A67FF',
    primaryLight: '#6B7FFF',
    
    // Status colors
    success: '#1EDD88',
    warning: '#FFD666',
    error: '#FF6B6B',
    
    // UI colors
    border: '#3A3A3C',
    separator: 'rgba(255,255,255,0.1)',
    overlay: 'rgba(0,0,0,0.5)',
    
    // Button colors
    buttonPrimary: '#4A67FF',
    buttonSecondary: '#2C2C2E',
    buttonText: '#FFFFFF',
    
    // Gradients
    gradientStart: '#4A67FF',
    gradientEnd: '#6B7FFF',
  };
  
  export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
  };
  
  export const typography = {
    largeTitle: {
      fontSize: 34,
      fontWeight: '700'  ,
      lineHeight: 41,
    },
    title1: {
      fontSize: 28,
      fontWeight: '700'  ,
      lineHeight: 34,
    },
    title2: {
      fontSize: 24,
      fontWeight: '600'  ,
      lineHeight: 30,
    },
    title3: {
      fontSize: 20,
      fontWeight: '600'  ,
      lineHeight: 25,
    },
    headline: {
      fontSize: 18,
      fontWeight: '600'  ,
      lineHeight: 22,
    },
    body: {
      fontSize: 16,
      fontWeight: '400'  ,
      lineHeight: 24,
    },
    bodyBold: {
      fontSize: 16,
      fontWeight: '600'  ,
      lineHeight: 24,
    },
    callout: {
      fontSize: 14,
      fontWeight: '500'  ,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400'  ,
      lineHeight: 18,
    },
  }  ;
  
  export const shadows = {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
  }  ;
  
  export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  }  ;
  
  export const theme = {
    colors,
    spacing,
    typography,
    shadows,
    borderRadius,
  }  ;
  