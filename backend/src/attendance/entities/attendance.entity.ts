import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { SchoolClass } from '../../classes/entities/class.entity';
import { User } from '../../users/entities/user.entity';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
}

@Entity('attendance')
@Unique(['student', 'schoolClass', 'date'])
@Index(['schoolClass', 'date'])
@Index(['student', 'date'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => SchoolClass, { nullable: false })
  @JoinColumn({ name: 'school_class_id' })
  schoolClass: SchoolClass;

  @Column({ name: 'school_class_id' })
  schoolClassId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'marked_by' })
  markedBy: User;

  @Column({ name: 'marked_by' })
  markedById: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
