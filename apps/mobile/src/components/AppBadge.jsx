import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../theme';

export function AppBadge({ label, status = 'NEW', type = 'lead', style, textStyle }) {
  let bg = COLORS.neutral[100];
  let color = COLORS.neutral[700];

  if (type === 'lead' && COLORS.leadStatus[status]) {
    bg = COLORS.leadStatus[status].bg;
    color = COLORS.leadStatus[status].text;
  } else if (type === 'priority' && COLORS.priority[status]) {
    bg = COLORS.priority[status].bg;
    color = COLORS.priority[status].text;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, TYPOGRAPHY.label, { color }, textStyle]}>
        {label || status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
