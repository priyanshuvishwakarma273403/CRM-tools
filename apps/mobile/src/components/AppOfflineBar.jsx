import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY } from '../theme';
import { WifiOff, RefreshCw } from 'lucide-react-native';

export function AppOfflineBar({ isOffline = false, pendingCount = 0 }) {
  if (!isOffline && pendingCount === 0) return null;

  return (
    <View style={[styles.container, isOffline ? styles.offlineBg : styles.syncingBg]}>
      {isOffline ? (
        <>
          <WifiOff size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={[styles.text, TYPOGRAPHY.caption]}>
            Working Offline. Changes queued ({pendingCount})
          </Text>
        </>
      ) : (
        <>
          <RefreshCw size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={[styles.text, TYPOGRAPHY.caption]}>
            Online. Syncing {pendingCount} changes to server...
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  offlineBg: {
    backgroundColor: COLORS.warning[600],
  },
  syncingBg: {
    backgroundColor: COLORS.primary[600],
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
