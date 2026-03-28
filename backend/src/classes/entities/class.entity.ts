import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';

@Entity('classes')
export class SchoolClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'academic_year' })
  academicYear: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToMany(() => User, (u) => u.teacherClasses)
  @JoinTable({
    name: 'teacher_classes',
    joinColumn: { name: 'class_id' },
    inverseJoinColumn: { name: 'teacher_id' },
  })
  teachers: User[];

  @ManyToMany(() => Student, (s) => s.classes)
  @JoinTable({
    name: 'student_classes',
    joinColumn: { name: 'class_id' },
    inverseJoinColumn: { name: 'student_id' },
  })
  students: Student[];
}
