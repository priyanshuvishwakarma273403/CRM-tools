import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppInput } from '../src/components/AppInput';
import { AppButton } from '../src/components/AppButton';
import { useAuthStore } from '../src/store/useAuthStore';
import { authApi } from '../src/api/authApi';
import { COLORS } from '../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../src/theme';
import { User, Mail, Lock, Building } from 'lucide-react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!fullName || !email || !password || !organizationName) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await authApi.register({
        fullName,
        email,
        password,
        organizationName,
      });

      if (response?.data) {
        useAuthStore.setState({
          user: response.data.user,
          organization: response.data.organization,
          isAuthenticated: true,
        });
        router.replace('/(tabs)');
      }
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
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
          <Text style={[styles.title, TYPOGRAPHY.h1]}>Create Account</Text>
          <Text style={[styles.subtitle, TYPOGRAPHY.body]}>Start setting up your commercial CRM</Text>
        </View>

        <View style={styles.formCard}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={[styles.errorText, TYPOGRAPHY.caption]}>{error}</Text>
            </View>
          ) : null}

          <AppInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="John Doe"
            leftIcon={User}
          />

          <AppInput
            label="Organization Name"
            value={organizationName}
            onChangeText={setOrganizationName}
            placeholder="Acme Global Inc"
            leftIcon={Building}
          />

          <AppInput
            label="Work Email"
            value={email}
            onChangeText={setEmail}
            placeholder="john@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={Mail}
          />

          <AppInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            leftIcon={Lock}
          />

          <AppButton
            title="Create Workspace"
            onPress={handleRegister}
            loading={loading}
            style={styles.submitBtn}
          />

          <AppButton
            title="Already have an account? Sign In"
            variant="ghost"
            onPress={() => router.push('/login')}
            style={styles.loginLink}
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
    padding: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xl,
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
    marginTop: SPACING.md,
  },
  loginLink: {
    marginTop: SPACING.xs,
  },
});
