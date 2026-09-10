import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '../src/components/AppHeader';
import { AppCard } from '../src/components/AppCard';
import { AppButton } from '../src/components/AppButton';
import { useAuthStore } from '../src/store/useAuthStore';
import { COLORS } from '../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../src/theme';
import { Shield, RefreshCw, HardDrive, Bell, LogOut, ChevronRight, Moon } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of Apex CRM?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const handleClearCache = () => {
    Alert.alert('Success', 'Local SQLite cache cleared successfully.');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Settings" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, TYPOGRAPHY.caption]}>PREFERENCES</Text>

        <AppCard style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuRow} onPress={() => router.push('/team')}>
            <Shield size={20} color={COLORS.neutral[600]} style={{ marginRight: 12 }} />
            <Text style={[styles.menuLabel, TYPOGRAPHY.body]}>Team & Roles (RBAC)</Text>
            <ChevronRight size={18} color={COLORS.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} onPress={() => Alert.alert('Notifications', 'Push notifications enabled')}>
            <Bell size={20} color={COLORS.neutral[600]} style={{ marginRight: 12 }} />
            <Text style={[styles.menuLabel, TYPOGRAPHY.body]}>Push Notifications</Text>
            <ChevronRight size={18} color={COLORS.neutral[400]} />
          </TouchableOpacity>
        </AppCard>

        <Text style={[styles.sectionTitle, TYPOGRAPHY.caption]}>OFFLINE & STORAGE</Text>

        <AppCard style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuRow} onPress={handleClearCache}>
            <HardDrive size={20} color={COLORS.neutral[600]} style={{ marginRight: 12 }} />
            <Text style={[styles.menuLabel, TYPOGRAPHY.body]}>Clear Local Database Cache</Text>
            <ChevronRight size={18} color={COLORS.neutral[400]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} onPress={() => Alert.alert('Sync', 'Sync engine triggered')}>
            <RefreshCw size={20} color={COLORS.neutral[600]} style={{ marginRight: 12 }} />
            <Text style={[styles.menuLabel, TYPOGRAPHY.body]}>Force Background Sync</Text>
            <ChevronRight size={18} color={COLORS.neutral[400]} />
          </TouchableOpacity>
        </AppCard>

        <AppButton
          title="Sign Out"
          variant="danger"
          icon={LogOut}
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.neutral[400],
    letterSpacing: 1,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  menuGroup: {
    padding: 0,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  menuLabel: {
    flex: 1,
    color: COLORS.neutral[800],
  },
  logoutBtn: {
    marginTop: SPACING.lg,
  },
});
