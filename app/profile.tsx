import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { userStore } from '../services/userStore';
import { useTheme } from '../services/theme';

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'personal', label: 'Особисті дані', icon: 'person-outline' },
  { id: 'achievements', label: 'Досягнення', icon: 'trophy-outline' },
  { id: 'finance', label: 'Фінанси та виплати', icon: 'wallet-outline' },
  { id: 'notifications', label: 'Сповіщення', icon: 'notifications-outline' },
  { id: 'settings', label: 'Налаштування', icon: 'settings-outline' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, mode, toggleTheme } = useTheme();
  const userName = userStore.getUser() || 'Користувач';

  const handleLogout = async () => {
    await userStore.clear();
    router.replace('/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>ПРОФІЛЬ</Text>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
            <Ionicons name="pencil" size={20} color={colors.iconColor} />
          </TouchableOpacity>
        </View>

        {/* Avatar icon */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.surface }]}>
              <Ionicons name="person-outline" size={40} color={colors.textSecondary} />
            </View>
            <View style={[styles.onlineIndicator, { borderColor: colors.onlineIndicatorBorder }]} />
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>42</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>ЗАВДАНЬ</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>1250</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>БАЛІ</Text>
          </View>
        </View>

        {/* Theme toggle */}
        <View style={[styles.themeToggleRow, { borderBottomColor: colors.borderLight }]}>
          <View style={styles.themeToggleLeft}>
            <Ionicons
              name={mode === 'light' ? 'sunny-outline' : 'moon-outline'}
              size={22}
              color={colors.iconColor}
            />
            <Text style={[styles.themeToggleLabel, { color: colors.text }]}>Світла тема</Text>
          </View>
          <Switch
            value={mode === 'light'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D0D0D0', true: '#7A8F7E' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { borderBottomColor: colors.borderLight }]}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={22} color={colors.iconColor} />
                <Text style={[styles.menuItemLabel, { color: colors.text }]}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.surface }]}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.accentRed} />
          <Text style={[styles.logoutText, { color: colors.accentRed }]}>Вийти з системи</Text>
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
    paddingBottom: 32,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    letterSpacing: 1.5,
  },

  // User Info
  userSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#7A8F7E',
    borderWidth: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 4,
  },

  // Theme toggle
  themeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    minHeight: 56,
    marginBottom: 4,
  },
  themeToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  themeToggleLabel: {
    fontSize: 16,
    fontWeight: '500',
  },

  // Menu
  menuSection: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    minHeight: 56,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 12,
    paddingVertical: 16,
    minHeight: 56,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
