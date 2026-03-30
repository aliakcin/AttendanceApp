import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, RouteProp } from '@react-navigation/native';
import api from '../../api/client';
import { colors } from '../../theme/colors';
import { Student, AttendanceStatus, RootStackParamList } from '../../types';

const today = () => new Date().toISOString().split('T')[0];

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: colors.success,
  absent: colors.danger,
  late: colors.warning,
};

export default function MarkAttendance() {
  const route = useRoute<RouteProp<RootStackParamList, 'MarkAttendance'>>();
  const { classId, className } = route.params;
  const queryClient = useQueryClient();
  const [date, setDate] = useState(today());
  const [records, setRecords] = useState<Record<string, AttendanceStatus>>({});

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['class-students', classId],
    queryFn: () => api.get<Student[]>(`/classes/${classId}/students`).then((r) => r.data),
  });

  const { data: existing, isLoading: loadingExisting } = useQuery({
    queryKey: ['attendance', classId, date],
    queryFn: () =>
      api.get(`/attendance?classId=${classId}&date=${date}`).then((r) => r.data),
    enabled: !!date,
  });

  // Initialize records when students load
  useEffect(() => {
    if (students && students.length > 0) {
      const init: Record<string, AttendanceStatus> = {};
      students.forEach((s) => {
        init[s.id] = 'present'; // default all present
      });
      // Override with existing records if any
      if (existing && existing.length > 0) {
        existing.forEach((a: any) => {
          init[a.studentId] = a.status;
        });
      }
      setRecords(init);
    }
  }, [students, existing]);

  const submitMutation = useMutation({
    mutationFn: () =>
      api.post('/attendance', {
        classId,
        date,
        records: Object.entries(records).map(([studentId, status]) => ({
          studentId,
          status,
        })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', classId, date] });
      Alert.alert('Success', 'Attendance saved successfully');
    },
    onError: (err: any) =>
      Alert.alert('Error', err.response?.data?.message || 'Failed to save'),
  });

  const handleSubmit = () => {
    Alert.alert(
      'Confirm',
      `Submit attendance for ${className} on ${date}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: () => submitMutation.mutate() },
      ],
    );
  };

  const markAllPresent = () => {
    if (!students) return;
    const init: Record<string, AttendanceStatus> = {};
    students.forEach((s) => { init[s.id] = 'present'; });
    setRecords(init);
  };

  const toggleStatus = (studentId: string, status: AttendanceStatus) => {
    setRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const isLoading = loadingStudents || loadingExisting;
  if (isLoading) return <ActivityIndicator style={styles.center} color={colors.primary} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <Text style={styles.classLabel}>Class</Text>
        <Text style={styles.classTitle}>{className}</Text>
        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>Session Date</Text>
          <TextInput
            style={styles.dateInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textLight}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.markAllBtn} onPress={markAllPresent}>
        <Text style={styles.markAllText}>Mark All Present</Text>
      </TouchableOpacity>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          students?.length === 0 ? styles.center : undefined,
        ]}
        ListEmptyComponent={<Text style={styles.empty}>No students in this class</Text>}
        renderItem={({ item }) => (
          <View style={styles.studentRow}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{item.fullName}</Text>
              {item.studentNumber && (
                <Text style={styles.studentNum}>#{item.studentNumber}</Text>
              )}
            </View>
            <View style={styles.statusButtons}>
              {(['present', 'absent', 'late'] as AttendanceStatus[]).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusBtn,
                    records[item.id] === status && {
                      backgroundColor: STATUS_COLORS[status],
                    },
                  ]}
                  onPress={() => toggleStatus(item.id, status)}
                >
                  <Text
                    style={[
                      styles.statusText,
                      records[item.id] === status && styles.statusTextActive,
                    ]}
                  >
                    {status.charAt(0).toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.submitBtn, submitMutation.isPending && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={submitMutation.isPending || Object.keys(records).length === 0}
      >
        {submitMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Attendance</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  classLabel: { fontSize: 13, fontWeight: '600', color: colors.textLight },
  classTitle: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: 2, marginBottom: 10 },
  dateRow: { gap: 8 },
  dateLabel: { fontSize: 14, color: colors.textLight, fontWeight: '600' },
  dateInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.text,
  },
  markAllBtn: {
    backgroundColor: colors.success,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  markAllText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  empty: { fontSize: 16, color: colors.textLight },
  listContent: { paddingBottom: 6 },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  studentInfo: { flex: 1, marginRight: 8 },
  studentName: { fontSize: 15, fontWeight: '500', color: colors.text },
  studentNum: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  statusButtons: { flexDirection: 'row', gap: 6 },
  statusBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  statusText: { fontSize: 14, fontWeight: '700', color: colors.textLight },
  statusTextActive: { color: '#fff' },
  submitBtn: {
    backgroundColor: colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
