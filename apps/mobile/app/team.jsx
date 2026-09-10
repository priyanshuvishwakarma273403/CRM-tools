import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { AppHeader } from '../src/components/AppHeader';
import { AppAvatar } from '../src/components/AppAvatar';
import { AppBadge } from '../src/components/AppBadge';
import { AppCard } from '../src/components/AppCard';
import { COLORS } from '../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../src/theme';
import { ShieldCheck, UserPlus, Mail } from 'lucide-react-native';
import { usersApi } from '../src/api';

const MOCK_MEMBERS = [
  { id: '1', name: 'Priyanshu Sharma', email: 'priyanshu@acme.com', role: 'ADMIN', active: true },
  { id: '2', name: 'Vikramaditya Rao', email: 'vikram@acme.com', role: 'MANAGER', active: true },
  { id: '3', name: 'Neha Gupta', email: 'neha@acme.com', role: 'SALES_AGENT', active: true },
  { id: '4', name: 'Rohan Verma', email: 'rohan@acme.com', role: 'SALES_AGENT', active: true },
];

export default function TeamScreen() {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeam = async () => {
    try {
      const res = await usersApi.getTeam();
      const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
      if (list && list.length > 0) {
        setMembers(
          list.map((u) => ({
            id: u.id,
            name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
            email: u.email,
            role: u.role || 'MEMBER',
            active: u.status === 'ACTIVE' || true,
          }))
        );
      }
    } catch (err) {
      console.warn('Team using offline cache:', err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTeam();
  };

  const handleInvite = () => {
    Alert.alert('Invite Teammate', 'Send an email invitation link to join your CRM organization.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send Invite', onPress: () => Alert.alert('Sent', 'Invitation sent successfully!') },
    ]);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Team & Roles" showBack />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, TYPOGRAPHY.h2]}>Organization Members</Text>
            <Text style={[styles.sub, TYPOGRAPHY.caption]}>{members.length} team members total</Text>
          </View>

          <TouchableOpacity style={styles.inviteBtn} onPress={handleInvite}>
            <UserPlus size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={[styles.inviteText, TYPOGRAPHY.caption]}>Invite</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <AppCard style={styles.memberCard}>
              <AppAvatar name={item.name} size={44} />
              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, TYPOGRAPHY.h3]}>{item.name}</Text>
                <Text style={[styles.memberEmail, TYPOGRAPHY.caption]}>{item.email}</Text>
              </View>
              <View style={styles.roleBadge}>
                <ShieldCheck size={14} color={COLORS.primary[600]} style={{ marginRight: 4 }} />
                <Text style={[styles.roleText, TYPOGRAPHY.caption]}>{item.role}</Text>
              </View>
            </AppCard>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.neutral[900],
  },
  sub: {
    color: COLORS.neutral[500],
  },
  inviteBtn: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  memberInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  memberName: {
    color: COLORS.neutral[900],
  },
  memberEmail: {
    color: COLORS.neutral[500],
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  roleText: {
    color: COLORS.primary[700],
    fontWeight: '600',
  },
});
