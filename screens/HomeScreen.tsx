import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TransformersLogo } from '../components/TransformersLogo';
import { useTheme } from '../services/theme';

interface HomeScreenProps {
  onNavigateToTasks?: () => void;
  onNavigateToProfile?: () => void;
  userName?: string;
}

export default function HomeScreen({
  onNavigateToTasks,
  onNavigateToProfile,
}: HomeScreenProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TransformersLogo width={32} height={22} color={colors.logoColor} />
          </View>
          <View style={styles.headerRight}>
            <View style={styles.ratingContainer}>
              <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>Рейтинг</Text>
              <Text style={[styles.ratingValue, { color: colors.ratingColor }]}>1250</Text>
            </View>
            <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={24} color={colors.iconColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              activeOpacity={0.7}
              onPress={onNavigateToProfile}
            >
              <Ionicons name="person-circle-outline" size={28} color={colors.iconColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>4/5</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>ЗАВДАНЬ</Text>
          </View>
        </View>

        {/* Tasks Card */}
        <TouchableOpacity
          style={[styles.tasksCard, { backgroundColor: colors.surface }]}
          activeOpacity={0.8}
          onPress={onNavigateToTasks}
        >
          <MaterialCommunityIcons
            name="chart-line-variant"
            size={28}
            color={colors.iconColor}
          />
          <Text style={[styles.tasksCardTitle, { color: colors.text }]}>Завдання</Text>
          <Text style={[styles.tasksCardLink, { color: colors.linkColor }]}>Переглянути список</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  ratingValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  bellButton: {
    padding: 4,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // Tasks Card
  tasksCard: {
    borderRadius: 16,
    marginTop: 16,
    padding: 20,
  },
  tasksCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },
  tasksCardLink: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },

  // Profile Button
  profileButton: {
    padding: 4,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
