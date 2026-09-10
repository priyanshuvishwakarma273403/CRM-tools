import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../src/components/AppHeader';
import { AppCard } from '../../src/components/AppCard';
import { AppBadge } from '../../src/components/AppBadge';
import { AppAvatar } from '../../src/components/AppAvatar';
import { AppFAB } from '../../src/components/AppFAB';
import { COLORS } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/theme';
import { Users, DollarSign, TrendingUp, Calendar, PhoneCall, CheckCircle } from 'lucide-react-native';
import { reportsApi, tasksApi } from '../../src/api';

export default function HomeScreen() {
  const [metrics, setMetrics] = useState({
    totalLeads: 128,
    openDeals: 24,
    revenue: 248000,
    conversionRate: '18.4%',
    completedTasks: 16,
  });
  const [todayTasks, setTodayTasks] = useState([
    { id: '1', title: 'Call Rahul Sharma', meta: '10:30 AM • Acme Technologies', priority: 'HIGH' },
    { id: '2', title: 'Send quotation follow-up', meta: '1:00 PM • Zenith Ltd', priority: 'MEDIUM' },
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [reportsRes, tasksRes] = await Promise.allSettled([
        reportsApi.getDashboard(),
        tasksApi.getAll(),
      ]);

      if (reportsRes.status === 'fulfilled' && reportsRes.value?.data) {
        setMetrics((prev) => ({ ...prev, ...reportsRes.value.data }));
      }

      if (tasksRes.status === 'fulfilled') {
        const list = tasksRes.value?.data?.content || (Array.isArray(tasksRes.value?.data) ? tasksRes.value.data : []);
        if (list && list.length > 0) {
          setTodayTasks(
            list.slice(0, 3).map((t) => ({
              id: t.id,
              title: t.title,
              meta: t.dueDate ? new Date(t.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'General Task',
              priority: t.priority || 'MEDIUM',
            }))
          );
        }
      }
    } catch (err) {
      console.warn('Dashboard using offline cache:', err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formattedRevenue = typeof metrics.revenue === 'number'
    ? `₹${(metrics.revenue / 100000).toFixed(2)}L`
    : `₹${metrics.revenue || '0'}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader
        title="Good morning, Priyanshu"
        subtitle="Here's what's happening today"
        rightElement={<AppAvatar name="Priyanshu Sharma" size={40} />}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* KPI Cards Horizontal Scroll */}
        <Text style={[styles.sectionTitle, TYPOGRAPHY.h3]}>Performance Overview</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiContainer}>
          <AppCard style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={[styles.kpiLabel, TYPOGRAPHY.caption]}>Total Leads</Text>
              <View style={[styles.kpiIcon, { backgroundColor: COLORS.info[50] }]}>
                <Users size={18} color={COLORS.info[500]} />
              </View>
            </View>
            <Text style={[styles.kpiValue, TYPOGRAPHY.h1]}>{metrics.totalLeads}</Text>
            <Text style={[styles.kpiSub, { color: COLORS.success[600] }]}>Active in funnel</Text>
          </AppCard>

          <AppCard style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={[styles.kpiLabel, TYPOGRAPHY.caption]}>Open Deals</Text>
              <View style={[styles.kpiIcon, { backgroundColor: COLORS.primary[50] }]}>
                <DollarSign size={18} color={COLORS.primary[600]} />
              </View>
            </View>
            <Text style={[styles.kpiValue, TYPOGRAPHY.h1]}>{metrics.openDeals}</Text>
            <Text style={[styles.kpiSub, { color: COLORS.neutral[500] }]}>Pipeline stage</Text>
          </AppCard>

          <AppCard style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={[styles.kpiLabel, TYPOGRAPHY.caption]}>Revenue</Text>
              <View style={[styles.kpiIcon, { backgroundColor: COLORS.success[50] }]}>
                <TrendingUp size={18} color={COLORS.success[500]} />
              </View>
            </View>
            <Text style={[styles.kpiValue, TYPOGRAPHY.h1]}>{formattedRevenue}</Text>
            <Text style={[styles.kpiSub, { color: COLORS.success[600] }]}>+18.4% target</Text>
          </AppCard>

          <AppCard style={styles.kpiCard}>
            <View style={styles.kpiHeader}>
              <Text style={[styles.kpiLabel, TYPOGRAPHY.caption]}>Tasks Done</Text>
              <View style={[styles.kpiIcon, { backgroundColor: COLORS.purple ? COLORS.purple[50] : '#f3e8ff' }]}>
                <CheckCircle size={18} color="#9333ea" />
              </View>
            </View>
            <Text style={[styles.kpiValue, TYPOGRAPHY.h1]}>{metrics.completedTasks ?? 0}</Text>
            <Text style={[styles.kpiSub, { color: COLORS.neutral[500] }]}>Completed</Text>
          </AppCard>
        </ScrollView>

        {/* Today's Tasks */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h3]}>Today's Tasks</Text>
          <Text style={[styles.viewAll, TYPOGRAPHY.caption]}>View all</Text>
        </View>

        {todayTasks.map((item) => (
          <AppCard key={item.id} style={styles.taskCard}>
            <View style={styles.taskRow}>
              <PhoneCall size={20} color={COLORS.primary[600]} />
              <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, TYPOGRAPHY.bodyMedium]}>{item.title}</Text>
                <Text style={[styles.taskMeta, TYPOGRAPHY.caption]}>{item.meta}</Text>
              </View>
              <AppBadge label={item.priority} status={item.priority} type="priority" />
            </View>
          </AppCard>
        ))}

        {/* Upcoming Meetings */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h3]}>Upcoming Meetings</Text>
        </View>

        <AppCard style={styles.meetingCard}>
          <View style={styles.meetingTime}>
            <Calendar size={18} color={COLORS.primary[600]} />
            <Text style={[styles.meetingTimeText, TYPOGRAPHY.bodyMedium]}>11:00 AM</Text>
          </View>
          <Text style={[styles.meetingTitle, TYPOGRAPHY.h3]}>Product Demo</Text>
          <Text style={[styles.meetingClient, TYPOGRAPHY.body]}>Rahul Sharma • Acme Technologies</Text>
        </AppCard>
      </ScrollView>

      <AppFAB onPress={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  sectionTitle: {
    color: COLORS.neutral[900],
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  viewAll: {
    color: COLORS.primary[600],
    fontWeight: '600',
  },
  kpiContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  kpiCard: {
    width: 160,
    marginRight: SPACING.md,
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiLabel: {
    color: COLORS.neutral[500],
  },
  kpiIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    marginVertical: SPACING.xs,
    color: COLORS.neutral[900],
  },
  kpiSub: {
    fontSize: 12,
    fontWeight: '500',
  },
  taskCard: {
    marginBottom: SPACING.sm,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  taskTitle: {
    color: COLORS.neutral[900],
  },
  taskMeta: {
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  meetingCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary[600],
  },
  meetingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  meetingTimeText: {
    marginLeft: SPACING.xs,
    color: COLORS.primary[600],
  },
  meetingTitle: {
    color: COLORS.neutral[900],
  },
  meetingClient: {
    color: COLORS.neutral[500],
    marginTop: 4,
  },
});
