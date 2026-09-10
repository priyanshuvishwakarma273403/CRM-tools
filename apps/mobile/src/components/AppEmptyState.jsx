import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppButton } from './AppButton';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../theme';

export function AppEmptyState({ title, description, icon: Icon, actionLabel, onAction, style }) {
  return (
    <View style={[styles.container, style]}>
      {Icon && (
        <View style={styles.iconWrapper}>
          <Icon size={36} color={COLORS.primary[600]} />
        </View>
      )}
      <Text style={[styles.title, TYPOGRAPHY.h3]}>{title}</Text>
      {description && <Text style={[styles.description, TYPOGRAPHY.body]}>{description}</Text>}
      {actionLabel && onAction && (
        <AppButton title={actionLabel} onPress={onAction} style={styles.actionButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    marginVertical: SPACING.xl,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.neutral[900],
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  description: {
    color: COLORS.neutral[500],
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  actionButton: {
    marginTop: SPACING.sm,
  },
});
