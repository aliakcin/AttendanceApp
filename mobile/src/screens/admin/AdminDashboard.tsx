import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user?.fullName}</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Admin Dashboard</Text>

      <View style={styles.cards}>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>📚</Text>
          <Text style={styles.cardTitle}>Classes</Text>
          <Text style={styles.cardDesc}>Manage classes and assignments</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>🎓</Text>
          <Text style={styles.cardTitle}>Students</Text>
          <Text style={styles.cardDesc}>Manage student records</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>👩‍🏫</Text>
          <Text style={styles.cardTitle}>Teachers</Text>
          <Text style={styles.cardDesc}>Manage teacher accounts</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  welcome: { fontSize: 18, fontWeight: '600', color: colors.text },
  logout: { fontSize: 14, color: colors.danger, fontWeight: '600' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  cards: { gap: 12 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 },
  cardDesc: { fontSize: 14, color: colors.textLight },
});
