import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../src/components/AppHeader';
import { AppCard } from '../../src/components/AppCard';
import { AppFAB } from '../../src/components/AppFAB';
import { COLORS } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/theme';
import { dealsApi } from '../../src/api';

const DEFAULT_STAGES = [
  { id: 'NEW', name: 'New', color: '#3B82F6', deals: [] },
  { id: 'PROPOSAL', name: 'Proposal Sent', color: '#F59E0B', deals: [] },
  { id: 'NEGOTIATION', name: 'Negotiation', color: '#EC4899', deals: [] },
  { id: 'WON', name: 'Closed Won', color: '#10B981', deals: [] },
];

export default function DealsScreen() {
  const [stages, setStages] = useState(DEFAULT_STAGES);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalValue, setTotalValue] = useState('₹6.25L');

  const fetchDeals = async () => {
    try {
      const res = await dealsApi.getPipeline();
      const list = res.data && Array.isArray(res.data) ? res.data : [];

      if (list.length > 0) {
        let total = 0;
        const newStages = DEFAULT_STAGES.map((stage) => {
          const matchedDeals = list
            .filter((d) => (d.stage || '').toUpperCase() === stage.id)
            .map((d) => {
              const val = Number(d.value || 0);
              total += val;
              return {
                id: d.id,
                title: d.title,
                value: `₹${val.toLocaleString('en-IN')}`,
                company: d.company?.name || 'Enterprise Client',
                prob: `${d.probability || 20}%`,
              };
            });
          return { ...stage, deals: matchedDeals };
        });

        setStages(newStages);
        setTotalValue(`₹${(total / 100000).toFixed(2)}L`);
      } else {
        // Mock fallback
        setStages([
          {
            id: 'NEW',
            name: 'New',
            color: '#3B82F6',
            deals: [{ id: 'd1', title: 'TechCorp Cloud Migration', value: '₹3,50,000', company: 'TechCorp Solutions', prob: '20%' }],
          },
          {
            id: 'PROPOSAL',
            name: 'Proposal Sent',
            color: '#F59E0B',
            deals: [
              { id: 'd2', title: 'Acme Enterprise Deal', value: '₹1,25,000', company: 'Acme Tech', prob: '60%' },
              { id: 'd3', title: 'Global Logistics Suite', value: '₹5,00,000', company: 'Global Express', prob: '50%' },
            ],
          },
          {
            id: 'NEGOTIATION',
            name: 'Negotiation',
            color: '#EC4899',
            deals: [{ id: 'd4', title: 'Zenith Security Contract', value: '₹2,10,000', company: 'Zenith Security', prob: '85%' }],
          },
          {
            id: 'WON',
            name: 'Closed Won',
            color: '#10B981',
            deals: [{ id: 'd5', title: 'Omega Software Upgrade', value: '₹95,000', company: 'Omega Ltd', prob: '100%' }],
          },
        ]);
      }
    } catch (err) {
      console.warn('Deals offline fallback:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDeals();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Sales Pipeline" subtitle={`Total value: ${totalValue}`} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.kanbanScroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {stages.map((stage) => (
            <View key={stage.id} style={styles.stageColumn}>
              <View style={styles.stageHeader}>
                <View style={[styles.stageBadgeDot, { backgroundColor: stage.color }]} />
                <Text style={[styles.stageTitle, TYPOGRAPHY.bodyMedium]}>{stage.name}</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{stage.deals.length}</Text>
                </View>
              </View>

              {stage.deals.map((deal) => (
                <AppCard key={deal.id} style={styles.dealCard}>
                  <Text style={[styles.dealTitle, TYPOGRAPHY.h3]}>{deal.title}</Text>
                  <Text style={[styles.dealCompany, TYPOGRAPHY.caption]}>{deal.company}</Text>

                  <View style={styles.dealFooter}>
                    <Text style={[styles.dealValue, TYPOGRAPHY.bodyMedium]}>{deal.value}</Text>
                    <View style={styles.probBadge}>
                      <Text style={styles.probText}>{deal.prob}</Text>
                    </View>
                  </View>
                </AppCard>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      <AppFAB onPress={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kanbanScroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  stageColumn: {
    width: 280,
    marginRight: SPACING.lg,
  },
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  stageBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  stageTitle: {
    color: COLORS.neutral[800],
    flex: 1,
  },
  countBadge: {
    backgroundColor: COLORS.neutral[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.neutral[600],
  },
  dealCard: {
    marginBottom: SPACING.md,
  },
  dealTitle: {
    color: COLORS.neutral[900],
  },
  dealCompany: {
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  dealValue: {
    fontWeight: '700',
    color: COLORS.neutral[900],
  },
  probBadge: {
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  probText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary[700],
  },
});
