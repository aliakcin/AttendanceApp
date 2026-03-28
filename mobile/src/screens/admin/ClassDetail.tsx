import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, RouteProp } from '@react-navigation/native';
import api from '../../api/client';
import { colors } from '../../theme/colors';
import { Student, User, RootStackParamList } from '../../types';

export default function ClassDetail() {
  const route = useRoute<RouteProp<RootStackParamList, 'ClassDetail'>>();
  const { classId, className } = route.params;
  const queryClient = useQueryClient();
  const [showTeacherPicker, setShowTeacherPicker] = useState(false);
  const [showStudentPicker, setShowStudentPicker] = useState(false);

  const { data: classInfo, isLoading } = useQuery({
    queryKey: ['class', classId],
    queryFn: () => api.get(`/classes/${classId}`).then((r) => r.data),
  });

  const { data: allTeachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => api.get<User[]>('/users?role=teacher').then((r) => r.data),
  });

  const { data: allStudents } = useQuery({
    queryKey: ['students'],
    queryFn: () => api.get<Student[]>('/students').then((r) => r.data),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['class', classId] });

  const assignTeacher = useMutation({
    mutationFn: (teacherId: string) => api.post(`/classes/${classId}/teachers`, { teacherId }),
    onSuccess: () => { invalidate(); setShowTeacherPicker(false); },
    onError: (e: any) => Alert.alert('Error', e.response?.data?.message || 'Failed'),
  });

  const removeTeacher = useMutation({
    mutationFn: (teacherId: string) => api.delete(`/classes/${classId}/teachers/${teacherId}`),
    onSuccess: invalidate,
  });

  const assignStudent = useMutation({
    mutationFn: (studentId: string) => api.post(`/classes/${classId}/students`, { studentId }),
    onSuccess: () => { invalidate(); setShowStudentPicker(false); },
    onError: (e: any) => Alert.alert('Error', e.response?.data?.message || 'Failed'),
  });

  const removeStudent = useMutation({
    mutationFn: (studentId: string) => api.delete(`/classes/${classId}/students/${studentId}`),
    onSuccess: invalidate,
  });

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} size="large" />;

  const assignedTeacherIds = new Set((classInfo?.teachers || []).map((t: User) => t.id));
  const assignedStudentIds = new Set((classInfo?.students || []).map((s: Student) => s.id));
  const unassignedTeachers = (allTeachers || []).filter((t: User) => !assignedTeacherIds.has(t.id));
  const unassignedStudents = (allStudents || []).filter((s: Student) => !assignedStudentIds.has(s.id));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{className}</Text>

      {/* Teachers section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Teachers</Text>
          <TouchableOpacity onPress={() => setShowTeacherPicker(true)}>
            <Text style={styles.addBtn}>+ Add</Text>
          </TouchableOpacity>
        </View>
        {(classInfo?.teachers || []).length === 0 ? (
          <Text style={styles.empty}>No teachers assigned</Text>
        ) : (
          (classInfo.teachers as User[]).map((t) => (
            <View key={t.id} style={styles.row}>
              <Text style={styles.rowText}>{t.fullName}</Text>
              <TouchableOpacity onPress={() => removeTeacher.mutate(t.id)}>
                <Text style={styles.removeBtn}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Students section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Students</Text>
          <TouchableOpacity onPress={() => setShowStudentPicker(true)}>
            <Text style={styles.addBtn}>+ Add</Text>
          </TouchableOpacity>
        </View>
        {(classInfo?.students || []).length === 0 ? (
          <Text style={styles.empty}>No students assigned</Text>
        ) : (
          (classInfo.students as Student[]).map((s) => (
            <View key={s.id} style={styles.row}>
              <Text style={styles.rowText}>{s.fullName}</Text>
              <TouchableOpacity onPress={() => removeStudent.mutate(s.id)}>
                <Text style={styles.removeBtn}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Teacher Picker Modal */}
      <Modal visible={showTeacherPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Teacher</Text>
            {unassignedTeachers.length === 0 ? (
              <Text style={styles.empty}>No available teachers</Text>
            ) : (
              <FlatList
                data={unassignedTeachers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickerRow}
                    onPress={() => assignTeacher.mutate(item.id)}
                  >
                    <Text style={styles.rowText}>{item.fullName}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowTeacherPicker(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Student Picker Modal */}
      <Modal visible={showStudentPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Student</Text>
            {unassignedStudents.length === 0 ? (
              <Text style={styles.empty}>No available students</Text>
            ) : (
              <FlatList
                data={unassignedStudents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickerRow}
                    onPress={() => assignStudent.mutate(item.id)}
                  >
                    <Text style={styles.rowText}>{item.fullName} {item.studentNumber ? `(${item.studentNumber})` : ''}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowStudentPicker(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  addBtn: { color: colors.primary, fontWeight: '600', fontSize: 15 },
  empty: { color: colors.textLight, fontSize: 14, padding: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowText: { fontSize: 15, color: colors.text },
  removeBtn: { color: colors.danger, fontWeight: '600', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: colors.card, borderRadius: 12, padding: 24, maxHeight: '60%' },
  modalTitle: { fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 12 },
  pickerRow: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: { marginTop: 12, alignItems: 'center', padding: 12, backgroundColor: colors.background, borderRadius: 8 },
  closeBtnText: { color: colors.textLight, fontWeight: '600' },
});
