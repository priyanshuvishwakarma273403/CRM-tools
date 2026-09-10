import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../src/components/AppHeader';
import { AppCard } from '../../src/components/AppCard';
import { AppBadge } from '../../src/components/AppBadge';
import { AppFAB } from '../../src/components/AppFAB';
import { COLORS } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/theme';
import { CheckCircle2, Clock, Calendar } from 'lucide-react-native';
import { tasksApi } from '../../src/api';

const TASK_TABS = ['All', 'Today', 'Upcoming', 'Completed'];

const MOCK_TASKS = [
  { id: '1', title: 'Send revised quotation to Acme', due: '10:30 AM', priority: 'HIGH', client: 'Acme Tech', status: 'TODO' },
  { id: '2', title: 'Schedule product demo with Zenith', due: '2:00 PM', priority: 'URGENT', client: 'Zenith Ltd', status: 'TODO' },
  { id: '3', title: 'Follow up on contract signature', due: '4:00 PM', priority: 'MEDIUM', client: 'Nexus', status: 'TODO' },
];

export default function TasksScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await tasksApi.getAll();
      const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
      if (list && list.length > 0) {
        const formatted = list.map((item) => ({
          id: item.id,
          title: item.title,
          due: item.dueDate ? new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No due date',
          priority: item.priority || 'MEDIUM',
          client: item.relatedEntityType ? `${item.relatedEntityType}` : (item.assignedUser?.firstName ? `Assigned to ${item.assignedUser.firstName}` : 'General'),
          status: item.status || 'TODO',
        }));
        setTasks(formatted);
      }
    } catch (err) {
      console.warn('Using offline mock tasks:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const handleToggleComplete = async (taskId) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: t.status === 'COMPLETED' ? 'TODO' : 'COMPLETED' } : t))
    );
    try {
      await tasksApi.complete(taskId);
    } catch (err) {
      console.warn('Failed to complete task on server:', err.message);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Completed') return t.status === 'COMPLETED';
    if (activeTab === 'Today') return t.status !== 'COMPLETED';
    if (activeTab === 'Upcoming') return t.status !== 'COMPLETED';
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader title="Tasks" subtitle="Stay organized and on schedule" />

      <View style={styles.tabsRow}>
        {TASK_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabChip, activeTab === tab && styles.activeTabChip]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary[600]} />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => {
            const isCompleted = item.status === 'COMPLETED';
            return (
              <AppCard style={[styles.taskCard, isCompleted && { opacity: 0.6 }]}>
                <View style={styles.cardHeader}>
                  <TouchableOpacity onPress={() => handleToggleComplete(item.id)}>
                    <CheckCircle2
                      size={24}
                      color={isCompleted ? COLORS.success[500] : COLORS.neutral[300]}
                    />
                  </TouchableOpacity>

                  <View style={styles.taskInfo}>
                    <Text
                      style={[
                        styles.title,
                        TYPOGRAPHY.bodyMedium,
                        isCompleted && { textDecorationLine: 'line-through', color: COLORS.neutral[400] },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={[styles.client, TYPOGRAPHY.caption]}>{item.client}</Text>
                    <View style={styles.dueRow}>
                      <Clock size={14} color={COLORS.neutral[400]} />
                      <Text style={[styles.dueText, TYPOGRAPHY.caption]}>{item.due}</Text>
                    </View>
                  </View>

                  <AppBadge label={item.priority} status={item.priority} type="priority" />
                </View>
              </AppCard>
            );
          }}
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
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  tabChip: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.neutral[100],
  },
  activeTabChip: {
    backgroundColor: COLORS.primary[600],
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.neutral[600],
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  taskCard: {
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  title: {
    color: COLORS.neutral[900],
  },
  client: {
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  dueText: {
    color: COLORS.neutral[400],
    marginLeft: 4,
  },
});
