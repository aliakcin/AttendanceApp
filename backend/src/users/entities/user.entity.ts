import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { SchoolClass } from '../../classes/entities/class.entity';
import { Student } from '../../students/entities/student.entity';

export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  PARENT = 'parent',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => SchoolClass, (sc) => sc.teachers)
  teacherClasses: SchoolClass[];

  @ManyToMany(() => Student, (s) => s.parents)
  @JoinTable({
    name: 'parent_students',
    joinColumn: { name: 'parent_id' },
    inverseJoinColumn: { name: 'student_id' },
  })
  children: Student[];
}
