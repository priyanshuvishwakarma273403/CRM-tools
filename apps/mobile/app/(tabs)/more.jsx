import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AppHeader } from '../../src/components/AppHeader';
import { AppCard } from '../../src/components/AppCard';
import { AppAvatar } from '../../src/components/AppAvatar';
import { useAuthStore } from '../../src/store/useAuthStore';
import { COLORS } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/theme';
import {
  Users,
  Building2,
  PieChart,
  Settings,
  ShieldCheck,
  Package,
  FileText,
  UserPlus,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';

export default function MoreScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const organization = useAuthStore((state) => state.organization);
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { title: 'Analytics & Reports', icon: PieChart, color: COLORS.primary[600], route: '/reports' },
    { title: 'Add New Lead', icon: UserPlus, color: COLORS.success[600], route: '/create-lead' },
    { title: 'Team & RBAC Roles', icon: ShieldCheck, color: COLORS.indigo[600], route: '/team' },
    { title: 'Settings & Cache', icon: Settings, color: COLORS.neutral[600], route: '/settings' },
  ];

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
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

  return (
    <View style={styles.container}>
      <AppHeader title="Workspace Menu" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <AppCard style={styles.profileCard}>
          <AppAvatar name={user?.fullName || 'Priyanshu Sharma'} size={56} />
          <View style={styles.profileDetails}>
            <Text style={[styles.userName, TYPOGRAPHY.h2]}>
              {user?.fullName || 'Priyanshu Sharma'}
            </Text>
            <Text style={[styles.userEmail, TYPOGRAPHY.caption]}>
              {user?.email || 'demo@apexcrm.com'}
            </Text>
            <View style={styles.orgTag}>
              <Building2 size={12} color={COLORS.primary[600]} style={{ marginRight: 4 }} />
              <Text style={[styles.orgText, TYPOGRAPHY.caption]}>
                {organization?.name || 'Acme Corporation'}
              </Text>
            </View>
          </View>
        </AppCard>

        {/* Navigation Grid */}
        <Text style={[styles.sectionTitle, TYPOGRAPHY.caption]}>CRM MODULES</Text>

        <AppCard style={styles.menuCard}>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={idx}
                style={styles.menuRow}
                onPress={() => router.push(item.route)}
              >
                <View style={[styles.iconBg, { backgroundColor: item.color + '15' }]}>
                  <Icon size={20} color={item.color} />
                </View>
                <Text style={[styles.menuTitle, TYPOGRAPHY.body]}>{item.title}</Text>
                <ChevronRight size={18} color={COLORS.neutral[400]} />
              </TouchableOpacity>
            );
          })}
        </AppCard>

        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <LogOut size={20} color={COLORS.danger[600]} style={{ marginRight: 12 }} />
          <Text style={[styles.logoutText, TYPOGRAPHY.body]}>Sign Out</Text>
        </TouchableOpacity>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  profileDetails: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  userName: {
    color: COLORS.neutral[900],
  },
  userEmail: {
    color: COLORS.neutral[500],
  },
  orgTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    marginTop: 4,
  },
  orgText: {
    color: COLORS.primary[700],
    fontWeight: '600',
  },
  sectionTitle: {
    color: COLORS.neutral[400],
    letterSpacing: 1,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuTitle: {
    flex: 1,
    color: COLORS.neutral[800],
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.danger[50],
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.danger[100],
  },
  logoutText: {
    color: COLORS.danger[600],
    fontWeight: '600',
  },
});
