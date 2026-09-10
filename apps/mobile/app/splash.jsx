import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { COLORS } from '../src/constants/colors';
import { TYPOGRAPHY, SPACING } from '../src/theme';

export default function SplashScreen() {
  const router = useRouter();
  const { initializeAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      await initializeAuth();
      if (!isMounted) return;

      setTimeout(() => {
        if (useAuthStore.getState().isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      }, 1000);
    };

    checkSession();
    return () => { isMounted = false; };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoBadge}>
        <Text style={styles.logoText}>APEX</Text>
      </View>
      <Text style={[styles.title, TYPOGRAPHY.h1]}>Apex CRM</Text>
      <Text style={[styles.subtitle, TYPOGRAPHY.body]}>Commercial Sales Platform</Text>
      
      <ActivityIndicator size="small" color={COLORS.primary[400]} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: 2,
  },
  title: {
    color: COLORS.neutral[50],
    letterSpacing: 0.5,
  },
  subtitle: {
    color: COLORS.neutral[400],
    marginTop: 4,
  },
  loader: {
    position: 'absolute',
    bottom: 60,
  },
});
