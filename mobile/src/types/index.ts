export type UserRole = 'admin' | 'teacher' | 'parent';
export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface SchoolClass {
  id: string;
  name: string;
  academicYear: string;
  isActive: boolean;
}

export interface Student {
  id: string;
  fullName: string;
  studentNumber: string | null;
  isActive: boolean;
}

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
}

export interface Attendance {
  id: string;
  student: Student;
  studentId: string;
  date: string;
  status: AttendanceStatus;
}

export type RootStackParamList = {
  Login: undefined;
  AdminTabs: undefined;
  TeacherHome: undefined;
  ClassDetail: { classId: string; className: string };
  MarkAttendance: { classId: string; className: string };
  CreateTeacher: undefined;
  CreateStudent: undefined;
  CreateClass: undefined;
};
