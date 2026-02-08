import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Task } from '../../data/mockTasks';
import { fetchTasks } from '../../services/mockApi';
import { useTheme, ThemeColors } from '../../services/theme';

const STATUS_COLORS: Record<Task['status'], string> = {
  done: '#7A8F7E',
  in_progress: '#A09580',
  pending: '#B0B0B0',
};

const STATUS_LABELS: Record<Task['status'], string> = {
  done: 'Виконано',
  in_progress: 'В роботі',
  pending: 'Очікує',
};

function StatusIcon({ status }: { status: Task['status'] }) {
  if (status === 'done') {
    return (
      <View style={[statusIconStyles.circle, { borderColor: STATUS_COLORS.done }]}>
        <Ionicons name="checkmark" size={16} color={STATUS_COLORS.done} />
      </View>
    );
  }
  if (status === 'in_progress') {
    return (
      <View style={[statusIconStyles.circle, { borderColor: STATUS_COLORS.in_progress }]}>
        <Ionicons name="time-outline" size={16} color={STATUS_COLORS.in_progress} />
      </View>
    );
  }
  return (
    <View style={[statusIconStyles.circle, { borderColor: STATUS_COLORS.pending }]}>
      <Ionicons name="time-outline" size={16} color={STATUS_COLORS.pending} />
    </View>
  );
}

const statusIconStyles = StyleSheet.create({
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function TaskCard({
  task,
  onPress,
  colors,
}: {
  task: Task;
  onPress: (task: Task) => void;
  colors: ThemeColors;
}) {
  const borderColor = STATUS_COLORS[task.status];

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: borderColor, backgroundColor: colors.surface }]}
      activeOpacity={0.7}
      onPress={() => onPress(task)}
    >
      {/* Top row: order number, VIN, status icon */}
      <View style={styles.cardTopRow}>
        <View style={styles.cardTopLeft}>
          <View style={[styles.orderBadge, { backgroundColor: borderColor }]}>
            <Text style={styles.orderBadgeText}>{task.orderNumber}</Text>
          </View>
          <Text style={[styles.vinText, { color: colors.textTertiary }]} numberOfLines={1}>
            {task.vin}
          </Text>
        </View>
        <StatusIcon status={task.status} />
      </View>

      {/* Operation name */}
      <Text style={[styles.operationText, { color: colors.text }]} numberOfLines={2}>
        {task.operation}
      </Text>

      {/* Model + Assignee row */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="car-outline" size={14} color={colors.iconSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>{task.model}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="person-outline" size={14} color={colors.iconSecondary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {task.assignee} {task.teamSize > 0 ? `+${task.teamSize}` : ''}
          </Text>
        </View>
      </View>

      {/* Bottom row: post + status badge */}
      <View style={[styles.cardBottomRow, { borderTopColor: colors.borderLight }]}>
        <Text style={[styles.postText, { color: colors.textMuted }]}>{task.post}</Text>
        {task.status === 'in_progress' && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {STATUS_LABELS[task.status]}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function TasksScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTasks();
  }, [loadTasks]);

  const handleTaskPress = useCallback(
    (task: Task) => {
      router.push(`/tasks/${task.id}` as any);
    },
    [router],
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const filteredTasks = searchQuery.trim()
    ? tasks.filter(
        (t) =>
          t.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.operation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.assignee.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : tasks;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>ВИРОБНИЧИЙ ПЛАН</Text>
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.7}
          onPress={() => router.push('/profile' as any)}
        >
          <Ionicons name="person-circle-outline" size={28} color={colors.iconColor} />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputWrapper, { backgroundColor: colors.inputBackground }]}>
          <Ionicons
            name="search"
            size={18}
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="VIN, замовлення або операція..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.inputBackground }]} activeOpacity={0.7}>
          <Ionicons name="filter-outline" size={22} color={colors.iconColor} />
        </TouchableOpacity>
      </View>

      {/* Task list */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onPress={handleTaskPress} colors={colors} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={48}
              color={colors.textMuted}
            />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Завдань не знайдено</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headerButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  clearButton: {
    padding: 4,
    minWidth: 28,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // Card
  card: {
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#9E9E9E',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
    gap: 8,
  },
  orderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  orderBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  vinText: {
    fontSize: 11,
    fontWeight: '400',
    flex: 1,
  },

  // Operation
  operationText: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 22,
  },

  // Meta row
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '400',
  },

  // Bottom row
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
  postText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'lowercase',
  },
  statusBadge: {
    backgroundColor: 'rgba(160, 149, 128, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(160, 149, 128, 0.25)',
  },
  statusBadgeText: {
    color: '#A09580',
    fontSize: 12,
    fontWeight: '600',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
