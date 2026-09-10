import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOWS, SPACING } from '../theme';

export function AppCard({ children, onPress, style, variant = 'elevated' }) {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        variant === 'elevated' && SHADOWS.sm,
        variant === 'outlined' && styles.outlined,
        style,
      ]}
    >
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  outlined: {
    shadowOpacity: 0,
    elevation: 0,
    borderColor: COLORS.neutral[300],
  },
});
