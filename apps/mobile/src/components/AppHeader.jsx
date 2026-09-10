import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY } from '../theme';

export function AppHeader({ title, subtitle, rightElement, leftElement, style }) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.leftContainer}>
        {leftElement}
        <View style={styles.titleGroup}>
          <Text style={[styles.title, TYPOGRAPHY.h2]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, TYPOGRAPHY.caption]}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement && <View style={styles.rightContainer}>{rightElement}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.neutral[50],
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleGroup: {
    marginLeft: SPACING.xs,
  },
  title: {
    color: COLORS.neutral[900],
  },
  subtitle: {
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
