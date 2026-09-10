import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AppInput } from '../src/components/AppInput';
import { AppButton } from '../src/components/AppButton';
import { COLORS } from '../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../src/theme';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReset = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <AppButton
          title="Back to Login"
          variant="ghost"
          icon={ArrowLeft}
          onPress={() => router.back()}
          style={styles.backBtn}
        />

        <View style={styles.card}>
          <Text style={[styles.title, TYPOGRAPHY.h2]}>Reset Password</Text>
          <Text style={[styles.subtitle, TYPOGRAPHY.body]}>
            Enter your account email to receive a password reset link.
          </Text>

          {submitted ? (
            <View style={styles.successBox}>
              <CheckCircle size={32} color={COLORS.success[500]} style={{ alignSelf: 'center', marginBottom: SPACING.sm }} />
              <Text style={[styles.successTitle, TYPOGRAPHY.h3]}>Check your email</Text>
              <Text style={[styles.successText, TYPOGRAPHY.caption]}>
                We sent instructions to {email}
              </Text>
              <AppButton title="Return to Login" onPress={() => router.replace('/login')} style={{ marginTop: SPACING.lg }} />
            </View>
          ) : (
            <>
              <AppInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="you@company.com"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={Mail}
              />

              <AppButton title="Send Reset Link" onPress={handleReset} loading={loading} style={styles.submitBtn} />
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  content: {
    padding: SPACING.xl,
    justifyContent: 'center',
    flex: 1,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  title: {
    color: COLORS.neutral[900],
  },
  subtitle: {
    color: COLORS.neutral[500],
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  submitBtn: {
    marginTop: SPACING.md,
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  successTitle: {
    color: COLORS.neutral[900],
  },
  successText: {
    color: COLORS.neutral[500],
    textAlign: 'center',
    marginTop: 4,
  },
});
