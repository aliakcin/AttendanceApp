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
  const { user, logout } = useAuth();

  const { data: classes, isLoading, error } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.get<SchoolClass[]>('/classes').then((r) => r.data),
  });

  if (isLoading) return <ActivityIndicator style={styles.center} color={colors.primary} size="large" />;
  if (error) return <Text style={styles.center}>Failed to load classes</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {user?.fullName}</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>My Classes</Text>

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={classes?.length === 0 ? styles.center : undefined}
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
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
  },
  welcome: { fontSize: 18, fontWeight: '600', color: colors.text },
  logout: { fontSize: 14, color: colors.danger, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.text, padding: 16, paddingBottom: 8 },
  empty: { fontSize: 16, color: colors.textLight },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
  cardSub: { fontSize: 13, color: colors.textLight, marginTop: 4 },
  cardAction: { fontSize: 13, color: colors.primary, marginTop: 8, fontWeight: '500' },
});
