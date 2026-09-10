import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOWS, SPACING } from '../theme';

export function AppFAB({ onPress, icon: Icon = Plus, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.fab, SHADOWS.lg, style]}
    >
      <Icon size={26} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});
