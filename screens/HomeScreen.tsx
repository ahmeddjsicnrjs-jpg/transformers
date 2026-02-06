import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TransformersLogo } from '../components/TransformersLogo';

interface HomeScreenProps {
  onNavigateToTasks?: () => void;
  onNavigateToProfile?: () => void;
  userName?: string;
}

export default function HomeScreen({
  onNavigateToTasks,
  onNavigateToProfile,
}: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TransformersLogo width={32} height={22} color="#FFFFFF" />
          </View>
          <View style={styles.headerRight}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Рейтинг</Text>
              <Text style={styles.ratingValue}>1250</Text>
            </View>
            <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              activeOpacity={0.7}
              onPress={onNavigateToProfile}
            >
              <Ionicons name="person-circle-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4/5</Text>
            <Text style={styles.statLabel}>ЗАВДАНЬ</Text>
          </View>
        </View>

        {/* Tasks Card */}
        <TouchableOpacity
          style={styles.tasksCard}
          activeOpacity={0.8}
          onPress={onNavigateToTasks}
        >
          <MaterialCommunityIcons
            name="chart-line-variant"
            size={28}
            color="#FFFFFF"
          />
          <Text style={styles.tasksCardTitle}>Завдання</Text>
          <Text style={styles.tasksCardLink}>Переглянути список</Text>
        </TouchableOpacity>
      </ScrollView>

    </SafeAreaView>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
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
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
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
    color: '#AAAAAA',
    fontSize: 12,
    fontWeight: '400',
  },
  ratingValue: {
    color: '#4CAF50',
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
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: '#AAAAAA',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // Tasks Card
  tasksCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginTop: 16,
    padding: 20,
  },
  tasksCardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },
  tasksCardLink: {
    color: '#4CAF50',
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
