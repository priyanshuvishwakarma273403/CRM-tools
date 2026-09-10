import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { AppHeader } from '../src/components/AppHeader';
import { AppCard } from '../src/components/AppCard';
import { COLORS } from '../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../src/theme';
import { TrendingUp, PieChart, Users, DollarSign, Target, Award } from 'lucide-react-native';
import { reportsApi } from '../src/api';

export default function ReportsScreen() {
  const [period, setPeriod] = useState('THIS_MONTH');
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState({
    revenue: '₹ 14,85,000',
    revenueGrowth: '+24.5%',
    conversionRate: '22.8%',
    avgDealSize: '₹ 3,45,000',
    topRep: 'Priyanshu Sharma',
  });

  const loadReports = async () => {
    try {
      const res = await reportsApi.getDashboard();
      if (res.data) {
        const d = res.data;
        setMetrics((prev) => ({
          ...prev,
          revenue: typeof d.revenue === 'number' ? `₹ ${d.revenue.toLocaleString()}` : (d.revenue || prev.revenue),
          conversionRate: d.conversionRate || prev.conversionRate,
        }));
      }
    } catch (err) {
      console.warn('Reports screen using offline data:', err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [period]);

  const onRefresh = () => {
    setRefreshing(true);
    loadReports();
  };

  const pipelineBreakdown = [
    { stage: 'New', count: 14, value: '₹ 4,20,000', color: COLORS.neutral[400] },
    { stage: 'Qualified', count: 8, value: '₹ 8,50,000', color: COLORS.primary[500] },
    { stage: 'Proposal', count: 5, value: '₹ 12,00,000', color: COLORS.warning[500] },
    { stage: 'Won', count: 12, value: '₹ 14,85,000', color: COLORS.success[500] },
  ];

  return (
    <View style={styles.container}>
      <AppHeader title="Analytics & Reports" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Time Period Filter */}
        <View style={styles.periodRow}>
          {['THIS_MONTH', 'THIS_QUARTER', 'THIS_YEAR'].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodChip, period === p && styles.periodChipActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive, TYPOGRAPHY.caption]}>
                {p.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview KPIs */}
        <View style={styles.gridRow}>
          <AppCard style={styles.kpiCard}>
            <View style={[styles.iconCircle, { backgroundColor: COLORS.success[50] }]}>
              <DollarSign size={20} color={COLORS.success[600]} />
            </View>
            <Text style={[styles.kpiLabel, TYPOGRAPHY.caption]}>Closed Revenue</Text>
            <Text style={[styles.kpiValue, TYPOGRAPHY.h2]}>{metrics.revenue}</Text>
            <Text style={[styles.growthText, TYPOGRAPHY.caption]}>{metrics.revenueGrowth} vs last period</Text>
          </AppCard>

          <AppCard style={styles.kpiCard}>
            <View style={[styles.iconCircle, { backgroundColor: COLORS.primary[50] }]}>
              <Target size={20} color={COLORS.primary[600]} />
            </View>
            <Text style={[styles.kpiLabel, TYPOGRAPHY.caption]}>Lead Conversion</Text>
            <Text style={[styles.kpiValue, TYPOGRAPHY.h2]}>{metrics.conversionRate}</Text>
            <Text style={[styles.growthText, TYPOGRAPHY.caption]}>Target: 20.0%</Text>
          </AppCard>
        </View>

        {/* Pipeline Distribution Card */}
        <AppCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <PieChart size={20} color={COLORS.primary[600]} style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitle, TYPOGRAPHY.h3]}>Pipeline Value Distribution</Text>
          </View>

          {pipelineBreakdown.map((item, idx) => (
            <View key={idx} style={styles.barItem}>
              <View style={styles.barHeader}>
                <Text style={[styles.stageName, TYPOGRAPHY.caption]}>{item.stage} ({item.count})</Text>
                <Text style={[styles.stageValue, TYPOGRAPHY.caption]}>{item.value}</Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${(idx + 1) * 23}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </AppCard>

        {/* Top Performer Card */}
        <AppCard style={styles.performerCard}>
          <Award size={32} color={COLORS.amber[500]} style={{ marginBottom: 8 }} />
          <Text style={[styles.performerTitle, TYPOGRAPHY.caption]}>Top Sales Performer</Text>
          <Text style={[styles.performerName, TYPOGRAPHY.h2]}>{metrics.topRep}</Text>
          <Text style={[styles.performerSub, TYPOGRAPHY.caption]}>Closed ₹ 8,20,000 this month (5 Deals)</Text>
        </AppCard>
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
  periodRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  periodChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.neutral[200],
    marginRight: SPACING.xs,
  },
  periodChipActive: {
    backgroundColor: COLORS.primary[600],
  },
  periodText: {
    color: COLORS.neutral[700],
  },
  periodTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  gridRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  kpiCard: {
    flex: 1,
    padding: SPACING.lg,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  kpiLabel: {
    color: COLORS.neutral[500],
  },
  kpiValue: {
    color: COLORS.neutral[900],
    marginTop: 2,
  },
  growthText: {
    color: COLORS.success[600],
    marginTop: 4,
    fontWeight: '500',
  },
  sectionCard: {
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.neutral[900],
  },
  barItem: {
    marginBottom: SPACING.md,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stageName: {
    color: COLORS.neutral[700],
  },
  stageValue: {
    color: COLORS.neutral[900],
    fontWeight: '600',
  },
  barTrack: {
    height: 8,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  performerCard: {
    padding: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.neutral[900],
  },
  performerTitle: {
    color: COLORS.amber[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  performerName: {
    color: '#FFFFFF',
    marginTop: 4,
  },
  performerSub: {
    color: COLORS.neutral[400],
    marginTop: 4,
  },
});
