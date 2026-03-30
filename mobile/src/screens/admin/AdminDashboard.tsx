
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';
import { AdminTabParamList } from '../../types';

export default function AdminDashboard() {
  const { user } = useAuth();
  const nav = useNavigation<BottomTabNavigationProp<AdminTabParamList, 'Dashboard'>>();

  return (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Welcome back</Text>
        <Text style={styles.heroTitle}>{user?.fullName}</Text>
        <Text style={styles.heroSub}>Manage classes, students, and teachers from one place.</Text>
      </View>

      <Text style={styles.sectionTitle}>Quick Access</Text>

      <View style={styles.cards}>
        <TouchableOpacity style={styles.card} onPress={() => nav.navigate('Classes')}>
          <Ionicons name="book-outline" size={30} color={colors.primary} />
          <Text style={styles.cardTitle}>Classes</Text>
          <Text style={styles.cardDesc}>Manage classes and assignments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => nav.navigate('Students')}>
          <Ionicons name="school-outline" size={30} color={colors.primary} />
          <Text style={styles.cardTitle}>Students</Text>
          <Text style={styles.cardDesc}>Manage student records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => nav.navigate('Teachers')}>
          <Ionicons name="people-outline" size={30} color={colors.primary} />
          <Text style={styles.cardTitle}>Teachers</Text>
          <Text style={styles.cardDesc}>Manage teacher accounts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16, paddingTop: 8 },
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 18,
  },
  heroEyebrow: { fontSize: 13, fontWeight: '600', color: colors.textLight, marginBottom: 4 },
  heroTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  heroSub: { fontSize: 14, color: colors.textLight, marginTop: 4, lineHeight: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 12 },
  cards: { gap: 12 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 },
  cardDesc: { fontSize: 14, color: colors.textLight },
});
