import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../src/components/AppHeader';
import { AppCard } from '../../src/components/AppCard';
import { AppBadge } from '../../src/components/AppBadge';
import { AppInput } from '../../src/components/AppInput';
import { AppFAB } from '../../src/components/AppFAB';
import { COLORS } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/theme';
import { Search, Phone, Mail } from 'lucide-react-native';
import { leadsApi } from '../../src/api';

const MOCK_LEADS = [
  {
    id: '1',
    name: 'Rahul Sharma',
    company: 'Acme Technologies',
    status: 'QUALIFIED',
    score: 85,
    nextFollowUp: 'Today, 4:30 PM',
    email: 'rahul@acme.com',
  },
  {
    id: '2',
    name: 'Ankit Verma',
    company: 'Nexus Global',
    status: 'CONTACTED',
    score: 65,
    nextFollowUp: 'Tomorrow, 11:00 AM',
    email: 'ankit@nexus.io',
  },
  {
    id: '3',
    name: 'Priya Patel',
    company: 'Innova Labs',
    status: 'NEW',
    score: 45,
    nextFollowUp: 'Sep 6, 2:00 PM',
    email: 'priya@innova.com',
  },
];

export default function LeadsScreen() {
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeads = async () => {
    try {
      const res = await leadsApi.getAll();
      const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
      if (list && list.length > 0) {
        const formatted = list.map((item) => ({
          id: item.id,
          name: `${item.firstName || ''} ${item.lastName || ''}`.trim() || item.name || 'Unnamed Lead',
          company: item.companyName || item.company || 'Private Client',
          status: item.status || 'NEW',
          score: item.score || 50,
          nextFollowUp: item.nextFollowUp ? new Date(item.nextFollowUp).toLocaleDateString() : 'Pending',
          email: item.email,
        }));
        setLeads(formatted);
      }
    } catch (err) {
      console.warn('Using offline mock leads:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeads();
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Leads" subtitle={`${leads.length} active leads`} />

      <View style={styles.searchRow}>
        <AppInput
          placeholder="Search leads by name, company..."
          value={search}
          onChangeText={setSearch}
          leftIcon={Search}
          containerStyle={styles.searchInput}
        />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
        </View>
      ) : (
        <FlatList
          data={filteredLeads}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <AppCard style={styles.leadCard}>
              <View style={styles.cardHeader}>
                <View style={styles.nameGroup}>
                  <Text style={[styles.name, TYPOGRAPHY.h3]}>{item.name}</Text>
                  <Text style={[styles.company, TYPOGRAPHY.caption]}>{item.company}</Text>
                </View>
                <AppBadge label={item.status} status={item.status} type="lead" />
              </View>

              <View style={styles.metaRow}>
                <Text style={[styles.metaText, TYPOGRAPHY.caption]}>
                  Lead Score: <Text style={styles.scoreText}>{item.score}</Text>
                </Text>
                <Text style={[styles.metaText, TYPOGRAPHY.caption]}>
                  Follow-up: {item.nextFollowUp}
                </Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.quickAction}>
                  <Phone size={16} color={COLORS.primary[600]} />
                  <Text style={[styles.actionText, TYPOGRAPHY.caption]}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickAction}>
                  <Mail size={16} color={COLORS.primary[600]} />
                  <Text style={[styles.actionText, TYPOGRAPHY.caption]}>Email</Text>
                </TouchableOpacity>
              </View>
            </AppCard>
          )}
        />
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
  searchRow: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
  },
  searchInput: {
    marginBottom: SPACING.xs,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  leadCard: {
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nameGroup: {
    flex: 1,
  },
  name: {
    color: COLORS.neutral[900],
  },
  company: {
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  metaText: {
    color: COLORS.neutral[500],
  },
  scoreText: {
    fontWeight: '700',
    color: COLORS.primary[600],
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  actionText: {
    marginLeft: SPACING.xs,
    color: COLORS.primary[600],
    fontWeight: '600',
  },
});
