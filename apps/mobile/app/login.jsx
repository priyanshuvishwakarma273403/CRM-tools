import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AppInput } from '../src/components/AppInput';
import { AppButton } from '../src/components/AppButton';
import { useAuthStore } from '../src/store/useAuthStore';
import { COLORS } from '../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../src/theme';
import { Mail, Lock } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState('demo@apexcrm.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={[styles.title, TYPOGRAPHY.h1]}>Welcome Back</Text>
          <Text style={[styles.subtitle, TYPOGRAPHY.body]}>Sign in to your CRM workspace</Text>
        </View>

        <View style={styles.formCard}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={[styles.errorText, TYPOGRAPHY.caption]}>{error}</Text>
            </View>
          ) : null}

          <AppInput
            label="Work Email"
            value={email}
            onChangeText={setEmail}
            placeholder="name@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={Mail}
          />

          <AppInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
            leftIcon={Lock}
          />

          <AppButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 24,
  },
  title: {
    color: COLORS.neutral[900],
  },
  subtitle: {
    color: COLORS.neutral[500],
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  errorBox: {
    backgroundColor: COLORS.danger[50],
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.danger[100],
  },
  errorText: {
    color: COLORS.danger[600],
  },
  submitBtn: {
    marginTop: SPACING.sm,
  },
});
