import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { SchoolClass } from '../../classes/entities/class.entity';
import { User } from '../../users/entities/user.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'student_number', type: 'varchar', unique: true, nullable: true })
  studentNumber: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToMany(() => SchoolClass, (sc) => sc.students)
  classes: SchoolClass[];

  @ManyToMany(() => User, (u) => u.children)
  parents: User[];
}
