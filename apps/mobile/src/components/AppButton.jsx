import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../theme';

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon: Icon,
  style,
  textStyle,
}) {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  const getBgColor = () => {
    if (disabled) return COLORS.neutral[200];
    if (isOutline || isGhost) return 'transparent';
    if (isDanger) return COLORS.danger[500];
    return COLORS.primary[600];
  };

  const getTextColor = () => {
    if (disabled) return COLORS.neutral[400];
    if (isOutline) return COLORS.primary[600];
    if (isGhost) return COLORS.neutral[700];
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        styles[size],
        { backgroundColor: getBgColor() },
        isOutline && { borderWidth: 1, borderColor: COLORS.primary[600] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {Icon && <Icon size={size === 'small' ? 16 : 20} color={getTextColor()} style={{ marginRight: SPACING.xs }} />}
          <Text style={[styles.text, TYPOGRAPHY.bodyMedium, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
  },
  small: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    height: 36,
  },
  medium: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    height: 48,
  },
  large: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    height: 54,
  },
  text: {
    textAlign: 'center',
  },
});
