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

const STATUS_COLORS: Record<Task['status'], string> = {
  done: '#4CAF50',
  in_progress: '#FFC107',
  pending: '#9E9E9E',
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
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ЗАВДАННЯ</Text>
          <View style={styles.headerButton} />
        </View>
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#666666" />
          <Text style={styles.notFoundText}>Завдання не знайдено</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = STATUS_COLORS[task.status];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ConfettiAnimation active={showConfetti} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ДЕТАЛІ ЗАВДАННЯ</Text>
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
        <Text style={styles.operationTitle}>{task.operation}</Text>

        {/* Description */}
        <Text style={styles.descriptionText}>{task.description}</Text>

        {/* Info cards */}
        <View style={styles.infoSection}>
          <InfoRow
            icon="car-outline"
            label="Модель"
            value={task.model}
          />
          <InfoRow
            icon="barcode-outline"
            label="VIN"
            value={task.vin}
          />
          <InfoRow
            icon="person-outline"
            label="Виконавець"
            value={`${task.assignee}${task.teamSize > 0 ? ` +${task.teamSize}` : ''}`}
          />
          <InfoRow
            icon="location-outline"
            label="Пост"
            value={task.post}
          />
          <InfoRow
            icon="calendar-outline"
            label="Початок"
            value={formatDate(task.startDate)}
          />
          <InfoRow
            icon="flag-outline"
            label="Дедлайн"
            value={formatDate(task.deadline)}
          />
          <InfoRow
            icon="cube-outline"
            label="Матеріали"
            value={task.materialReceived ? 'Отримано' : 'Не отримано'}
            valueColor={task.materialReceived ? '#4CAF50' : '#FF5722'}
          />
        </View>
      </ScrollView>

      {/* Bottom action button */}
      {task.status === 'pending' && (
        <View style={styles.bottomAction}>
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
        <View style={styles.bottomAction}>
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
        <View style={styles.bottomAction}>
          <View style={[styles.actionButton, styles.doneIndicator]}>
            <Ionicons name="checkmark-done" size={22} color="#4CAF50" />
            <Text style={[styles.actionButtonText, { color: '#4CAF50' }]}>
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
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabel}>
        <Ionicons name={icon} size={18} color="#888888" />
        <Text style={styles.infoLabelText}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, valueColor ? { color: valueColor } : undefined]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundText: {
    color: '#666666',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 8,
  },

  // Description
  descriptionText: {
    color: '#AAAAAA',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },

  // Info section
  infoSection: {
    backgroundColor: '#1A1A1A',
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
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    color: '#FFFFFF',
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
    borderTopColor: '#1A1A1A',
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
    backgroundColor: '#0057B8',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  doneIndicator: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
