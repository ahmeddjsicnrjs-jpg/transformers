import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Task } from '../../data/mockTasks';
import { fetchTaskById, updateTaskStatus } from '../../services/mockApi';
import ConfettiAnimation from '../../components/ConfettiAnimation';
import { useTheme, ThemeColors } from '../../services/theme';

const STATUS_COLORS: Record<Task['status'], string> = {
  done: '#5B9A65',
  in_progress: '#C9A340',
  pending: '#A0A0A0',
};

const STATUS_LABELS: Record<Task['status'], string> = {
  done: 'Виконано',
  in_progress: 'В роботі',
  pending: 'Очікує',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const loadTask = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchTaskById(id);
      setTask(data ?? null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleStatusUpdate = useCallback(
    async (newStatus: Task['status']) => {
      if (!task) return;
      setUpdating(true);
      try {
        const updated = await updateTaskStatus(task.id, newStatus);
        setTask(updated);
        if (newStatus === 'done') {
          setShowConfetti(true);
        }
      } catch {
        Alert.alert('Помилка', 'Не вдалося оновити статус завдання');
      } finally {
        setUpdating(false);
      }
    },
    [task],
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>ЗАВДАННЯ</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.notFoundText, { color: colors.textMuted }]}>Завдання не знайдено</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = STATUS_COLORS[task.status];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ConfettiAnimation active={showConfetti} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>ДЕТАЛІ ЗАВДАННЯ</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status badge + order number */}
        <View style={styles.topRow}>
          <View style={[styles.statusBadge, { borderColor: statusColor }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {STATUS_LABELS[task.status]}
            </Text>
          </View>
          <View style={[styles.orderBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.orderBadgeText}>{task.orderNumber}</Text>
          </View>
        </View>

        {/* Operation name */}
        <Text style={[styles.operationTitle, { color: colors.text }]}>{task.operation}</Text>

        {/* Description */}
        <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>{task.description}</Text>

        {/* Info cards */}
        <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
          <InfoRow icon="car-outline" label="Модель" value={task.model} colors={colors} />
          <InfoRow icon="barcode-outline" label="VIN" value={task.vin} colors={colors} />
          <InfoRow
            icon="person-outline"
            label="Виконавець"
            value={`${task.assignee}${task.teamSize > 0 ? ` +${task.teamSize}` : ''}`}
            colors={colors}
          />
          <InfoRow icon="location-outline" label="Пост" value={task.post} colors={colors} />
          <InfoRow icon="calendar-outline" label="Початок" value={formatDate(task.startDate)} colors={colors} />
          <InfoRow icon="flag-outline" label="Дедлайн" value={formatDate(task.deadline)} colors={colors} />
          <InfoRow
            icon="cube-outline"
            label="Матеріали"
            value={task.materialReceived ? 'Отримано' : 'Не отримано'}
            valueColor={task.materialReceived ? '#5B9A65' : '#B06060'}
            colors={colors}
          />
        </View>
      </ScrollView>

      {/* Bottom action button */}
      {task.status === 'pending' && (
        <View style={[styles.bottomAction, { borderTopColor: colors.surface }]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.startButton]}
            onPress={() => handleStatusUpdate('in_progress')}
            activeOpacity={0.7}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="play" size={22} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Почати</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {task.status === 'in_progress' && (
        <View style={[styles.bottomAction, { borderTopColor: colors.surface }]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => handleStatusUpdate('done')}
            activeOpacity={0.7}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Завершити</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {task.status === 'done' && (
        <View style={[styles.bottomAction, { borderTopColor: colors.surface }]}>
          <View style={[styles.actionButton, styles.doneIndicator]}>
            <Ionicons name="checkmark-done" size={22} color="#5B9A65" />
            <Text style={[styles.actionButtonText, { color: '#5B9A65' }]}>
              Завдання виконано
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
  valueColor,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
  colors: ThemeColors;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabel}>
        <Ionicons name={icon} size={18} color={colors.iconSecondary} />
        <Text style={[styles.infoLabelText, { color: colors.textTertiary }]}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, { color: valueColor || colors.text }]}>
        {value}
      </Text>
    </View>
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
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '500',
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

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  orderBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Operation
  operationTitle: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 8,
  },

  // Description
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },

  // Info section
  infoSection: {
    borderRadius: 14,
    padding: 16,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    maxWidth: '55%',
  },

  // Bottom action
  bottomAction: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 10,
    minHeight: 56,
  },
  startButton: {
    backgroundColor: '#333333',
  },
  completeButton: {
    backgroundColor: '#333333',
  },
  doneIndicator: {
    backgroundColor: 'rgba(91, 154, 101, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(91, 154, 101, 0.25)',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
