import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');

    if (Platform.OS === 'android') {
      BackHandler.exitApp();
      return;
    }

    Alert.alert('Close unavailable', 'iPhone apps cannot close themselves programmatically.');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <View style={styles.topContent}>
              <View style={styles.brandBlock}>
                <View style={styles.titleRow}>
                  <Ionicons name="checkbox" size={28} color="#FFFFFF" />
                  <Text style={styles.title}>Codebrotherhood</Text>
                </View>
                <Text style={styles.subtitle}>We make technology work for you!</Text>
              </View>

              <View style={styles.productLockup}>
                <Ionicons name="play" size={24} color="#8D8D93" />
                <Text style={styles.productTextLight}>Smart</Text>
                <Text style={styles.productTextAccent}>School</Text>
                <Text style={styles.productVersion}> v.15</Text>
              </View>

              <View style={styles.formSection}>
                {error ? (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={18} color="#FF6B6B" />
                    <Text style={styles.error}>{error}</Text>
                  </View>
                ) : null}

                <View style={styles.stack}>
                  <View style={styles.inputRow}>
                    <Ionicons name="person" size={18} color="#8D8D93" />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#8D8D93"
                      selectionColor={colors.primary}
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <Ionicons name="lock-closed" size={18} color="#8D8D93" />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      placeholderTextColor="#8D8D93"
                      selectionColor={colors.primary}
                    />
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.actionRow,
                      loading && styles.buttonDisabled,
                      pressed && !loading && styles.actionRowPressed,
                    ]}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    <View style={[styles.actionIconWrap, styles.loginIconWrap]}>
                      {loading ? (
                        <ActivityIndicator size="small" color="#F59E0B" />
                      ) : (
                        <Ionicons name="lock-open" size={16} color="#F59E0B" />
                      )}
                    </View>
                    <Text style={styles.actionPrimaryText}>SmartSchool v.15 Login</Text>
                  </Pressable>

                  {Platform.OS === 'android' ? (
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionRow,
                        pressed && styles.actionRowPressed,
                      ]}
                      onPress={handleClose}
                    >
                      <View style={[styles.actionIconWrap, styles.closeIconWrap]}>
                        <Ionicons name="close-circle" size={16} color="#EF4444" />
                      </View>
                      <Text style={styles.actionSecondaryText}>Close</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerLine}>KKTC&apos;s most preferred school management system</Text>
              <Text style={styles.footerLine}>Codebrotherhood Software Solutions</Text>
              <Text style={styles.footerLinks}>www.codebrotherhood.com |www.smartschool4.com</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141416',
  },
  keyboardWrap: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  topContent: {
    flexShrink: 0,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    color: '#A1A1AA',
    textAlign: 'center',
  },
  productLockup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  productTextLight: {
    fontSize: 22,
    color: '#9B9BA1',
    fontWeight: '400',
  },
  productTextAccent: {
    fontSize: 22,
    color: '#44A7F7',
    fontWeight: '400',
  },
  productVersion: {
    fontSize: 18,
    color: '#FF6B5F',
    fontWeight: '700',
  },
  error: {
    color: '#FFD7D7',
    flex: 1,
    fontSize: 14,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#3A2628',
    borderWidth: 1,
    borderColor: '#6E3135',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  formSection: {
    marginTop: 88,
  },
  stack: {
    gap: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: 17,
    color: '#2F2F33',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  actionRowPressed: {
    opacity: 0.92,
  },
  actionIconWrap: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  loginIconWrap: {
    marginRight: 10,
  },
  closeIconWrap: {
    marginRight: 10,
  },
  actionPrimaryText: {
    color: '#2F2F33',
    fontSize: 16,
    fontWeight: '700',
  },
  actionSecondaryText: {
    color: '#2F2F33',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    paddingTop: 44,
    alignItems: 'center',
  },
  footerLine: {
    color: '#8D8D93',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 2,
  },
  footerLinks: {
    color: '#4EA8FF',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
