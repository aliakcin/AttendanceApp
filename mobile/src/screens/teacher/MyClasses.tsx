import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';
import { SchoolClass, RootStackParamList } from '../../types';

export default function MyClasses() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const { data: classes, isLoading, error } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.get<SchoolClass[]>('/classes').then((r) => r.data),
  });

  if (isLoading) return <ActivityIndicator style={styles.center} color={colors.primary} size="large" />;
  if (error) return <Text style={styles.center}>Failed to load classes</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Teacher</Text>
        <Text style={styles.heroTitle}>{user?.fullName}</Text>
        <Text style={styles.heroSub}>Select a class to mark attendance for today.</Text>
      </View>

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, classes?.length === 0 ? styles.center : undefined]}
        ListEmptyComponent={<Text style={styles.empty}>No classes assigned</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              nav.navigate('MarkAttendance', { classId: item.id, className: item.name })
            }
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSub}>{item.academicYear}</Text>
            <Text style={styles.cardAction}>Tap to mark attendance →</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroCard: {
    marginHorizontal: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  heroEyebrow: { fontSize: 13, color: colors.textLight, fontWeight: '600', marginBottom: 4 },
  heroTitle: { fontSize: 23, fontWeight: '700', color: colors.text },
  heroSub: { fontSize: 14, color: colors.textLight, marginTop: 4 },
  listContent: { paddingBottom: 20 },
  empty: { fontSize: 16, color: colors.textLight },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
  cardSub: { fontSize: 13, color: colors.textLight, marginTop: 4 },
  cardAction: { fontSize: 13, color: colors.primary, marginTop: 8, fontWeight: '500' },
});
