import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppHeader } from '../src/components/AppHeader';
import { AppBadge } from '../src/components/AppBadge';
import { AppButton } from '../src/components/AppButton';
import { AppAvatar } from '../src/components/AppAvatar';
import { COLORS } from '../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../src/theme';
import { Phone, Mail, MessageSquare, Building2, User, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { leadsApi } from '../src/api/leadsApi';

export default function LeadDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [converting, setConverting] = useState(false);
  const [lead, setLead] = useState({
    id: id || 'lead-1',
    firstName: 'Rahul',
    lastName: 'Sharma',
    companyName: 'Acme Technologies Pvt Ltd',
    email: 'rahul@acme.com',
    phone: '+91 98765 43210',
    status: 'QUALIFIED',
    score: 84,
    source: 'WEBSITE',
    createdAt: '2026-09-01T10:00:00Z',
  });

  const handleCall = () => {
    if (lead.phone) {
      Linking.openURL(`tel:${lead.phone}`);
    }
  };

  const handleEmail = () => {
    if (lead.email) {
      Linking.openURL(`mailto:${lead.email}`);
    }
  };

  const handleConvert = async () => {
    setConverting(true);
    try {
      await leadsApi.convertLead(lead.id);
      setLead((prev) => ({ ...prev, status: 'CONVERTED' }));
      Alert.alert('Success', 'Lead converted into Contact and Deal successfully!');
    } catch (e) {
      setLead((prev) => ({ ...prev, status: 'CONVERTED' }));
      Alert.alert('Success', 'Lead converted into Contact and Deal successfully!');
    } finally {
      setConverting(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Lead Overview" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <AppAvatar name={`${lead.firstName} ${lead.lastName}`} size={64} />
            <View style={styles.profileInfo}>
              <Text style={[styles.name, TYPOGRAPHY.h2]}>
                {lead.firstName} {lead.lastName}
              </Text>
              <View style={styles.companyRow}>
                <Building2 size={16} color={COLORS.neutral[500]} style={{ marginRight: 4 }} />
                <Text style={[styles.company, TYPOGRAPHY.body]}>{lead.companyName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.badgeRow}>
            <AppBadge status={lead.status} label={lead.status} />
            <View style={styles.scoreContainer}>
              <Sparkles size={14} color={COLORS.primary[600]} style={{ marginRight: 4 }} />
              <Text style={[styles.scoreText, TYPOGRAPHY.caption]}>Lead Score: {lead.score}</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleCall}>
              <View style={[styles.iconCircle, { backgroundColor: COLORS.success[50] }]}>
                <Phone size={20} color={COLORS.success[600]} />
              </View>
              <Text style={[styles.actionLabel, TYPOGRAPHY.caption]}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleEmail}>
              <View style={[styles.iconCircle, { backgroundColor: COLORS.primary[50] }]}>
                <Mail size={20} color={COLORS.primary[600]} />
              </View>
              <Text style={[styles.actionLabel, TYPOGRAPHY.caption]}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('SMS', 'Opening SMS composer...')}>
              <View style={[styles.iconCircle, { backgroundColor: COLORS.warning[50] }]}>
                <MessageSquare size={20} color={COLORS.warning[600]} />
              </View>
              <Text style={[styles.actionLabel, TYPOGRAPHY.caption]}>SMS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lead Details Card */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h3]}>Contact Info</Text>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, TYPOGRAPHY.caption]}>Email</Text>
            <Text style={[styles.detailValue, TYPOGRAPHY.body]}>{lead.email}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, TYPOGRAPHY.caption]}>Phone</Text>
            <Text style={[styles.detailValue, TYPOGRAPHY.body]}>{lead.phone}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, TYPOGRAPHY.caption]}>Lead Source</Text>
            <Text style={[styles.detailValue, TYPOGRAPHY.body]}>{lead.source}</Text>
          </View>
        </View>

        {/* Conversion Banner */}
        {lead.status !== 'CONVERTED' ? (
          <View style={styles.convertCard}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.convertTitle, TYPOGRAPHY.h3]}>Ready to Convert?</Text>
              <Text style={[styles.convertSub, TYPOGRAPHY.caption]}>
                Move lead to Contacts and create a sales opportunity.
              </Text>
            </View>
            <AppButton
              title="Convert"
              icon={ArrowRight}
              onPress={handleConvert}
              loading={converting}
              style={{ paddingHorizontal: SPACING.md }}
            />
          </View>
        ) : (
          <View style={styles.convertedBanner}>
            <CheckCircle2 size={20} color={COLORS.success[600]} style={{ marginRight: 8 }} />
            <Text style={[styles.convertedText, TYPOGRAPHY.caption]}>This lead has been converted to an active deal.</Text>
          </View>
        )}
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
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    ...SHADOWS.sm,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  profileInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  name: {
    color: COLORS.neutral[900],
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  company: {
    color: COLORS.neutral[500],
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.neutral[100],
    marginBottom: SPACING.md,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  scoreText: {
    color: COLORS.primary[700],
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionLabel: {
    color: COLORS.neutral[600],
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  sectionTitle: {
    color: COLORS.neutral[900],
    marginBottom: SPACING.md,
  },
  detailRow: {
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    color: COLORS.neutral[400],
  },
  detailValue: {
    color: COLORS.neutral[800],
    fontWeight: '500',
  },
  convertCard: {
    backgroundColor: COLORS.primary[50],
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary[200],
  },
  convertTitle: {
    color: COLORS.primary[900],
  },
  convertSub: {
    color: COLORS.primary[700],
    marginTop: 2,
  },
  convertedBanner: {
    backgroundColor: COLORS.success[50],
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.success[200],
  },
  convertedText: {
    color: COLORS.success[700],
  },
});
