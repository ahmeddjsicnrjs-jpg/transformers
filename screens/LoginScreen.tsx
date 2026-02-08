import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TransformersLogo } from '../components/TransformersLogo';
import { userStore } from '../services/userStore';
import { useTheme } from '../services/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    userStore.loadUser().then((savedEmail) => {
      if (savedEmail) {
        setEmail(savedEmail);
      }
    });
  }, []);

  const handleLogin = async () => {
    // MVP: skip real auth, save entered email/name and navigate to home
    await userStore.setUser(email);
    router.replace('/home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo section */}
          <View style={styles.logoSection}>
            <TransformersLogo width={120} height={83} color={colors.logoColor} />
            <Text style={[styles.subtitle, { color: colors.subtitleColor }]}>
              Введіть облікові дані співробітника
            </Text>
          </View>

          {/* Form section */}
          <View style={styles.formSection}>
            {/* Email field */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>ID АБО EMAIL</Text>
              <View style={[styles.inputContainer, { borderBottomColor: colors.border }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="user@transformers.com.ua"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password field */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>ПАРОЛЬ</Text>
              <View style={[styles.inputContainer, { borderBottomColor: colors.border }]}>
                <TextInput
                  style={[styles.input, styles.passwordInput, { color: colors.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.forgotButton}>
                <Text style={[styles.forgotText, { color: colors.textTertiary }]}>Забули пароль?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Spacer to push button toward bottom */}
          <View style={styles.spacer} />

          {/* Login button */}
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.buttonBackground }]}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={[styles.loginButtonText, { color: colors.buttonText }]}>УВІЙТИ В СИСТЕМУ</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.buttonText} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  // Logo
  logoSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 24,
    textAlign: 'center',
  },
  // Form
  formSection: {
    gap: 24,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    padding: 12,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotText: {
    fontSize: 14,
  },
  // Spacer
  spacer: {
    flex: 1,
    minHeight: 60,
  },
  // Button
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 18,
    gap: 10,
    minHeight: 60,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
