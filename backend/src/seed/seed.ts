import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { SchoolClass } from '../classes/entities/class.entity';
import { Student } from '../students/entities/student.entity';

async function seed() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'meteakcin',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'attendance_db',
    entities: [User, SchoolClass, Student],
    synchronize: true,
  });

  await ds.initialize();
  console.log('Connected to database');

  const userRepo = ds.getRepository(User);
  const classRepo = ds.getRepository(SchoolClass);
  const studentRepo = ds.getRepository(Student);

  // Create admin
  const admin = await userRepo.save(
    userRepo.create({
      email: 'admin@school.com',
      passwordHash: await bcrypt.hash('admin123', 12),
      fullName: 'Admin User',
      role: UserRole.ADMIN,
    }),
  );
  console.log('Created admin:', admin.email);

  // Create teachers
  const teacher1 = await userRepo.save(
    userRepo.create({
      email: 'teacher1@school.com',
      passwordHash: await bcrypt.hash('teacher123', 12),
      fullName: 'Sarah Johnson',
      role: UserRole.TEACHER,
    }),
  );
  const teacher2 = await userRepo.save(
    userRepo.create({
      email: 'teacher2@school.com',
      passwordHash: await bcrypt.hash('teacher123', 12),
      fullName: 'Michael Chen',
      role: UserRole.TEACHER,
    }),
  );
  console.log('Created teachers:', teacher1.email, teacher2.email);

  // Create classes
  const class1 = await classRepo.save(
    classRepo.create({ name: 'Grade 5A', academicYear: '2025-2026', teachers: [teacher1] }),
  );
  const class2 = await classRepo.save(
    classRepo.create({ name: 'Grade 6B', academicYear: '2025-2026', teachers: [teacher2] }),
  );
  console.log('Created classes:', class1.name, class2.name);

  // Create students
  const studentNames = [
    { fullName: 'Emma Wilson', studentNumber: 'STU001' },
    { fullName: 'Liam Brown', studentNumber: 'STU002' },
    { fullName: 'Olivia Davis', studentNumber: 'STU003' },
    { fullName: 'Noah Martinez', studentNumber: 'STU004' },
    { fullName: 'Ava Garcia', studentNumber: 'STU005' },
    { fullName: 'Ethan Rodriguez', studentNumber: 'STU006' },
  ];

  const students: Student[] = [];
  for (const s of studentNames) {
    students.push(await studentRepo.save(studentRepo.create(s)));
  }
  console.log('Created', students.length, 'students');

  // Assign students to classes
  class1.students = students.slice(0, 3);
  class2.students = students.slice(3, 6);
  await classRepo.save(class1);
  await classRepo.save(class2);
  console.log('Assigned students to classes');

  console.log('\n--- Seed complete ---');
  console.log('Login credentials:');
  console.log('  Admin:    admin@school.com / admin123');
  console.log('  Teacher1: teacher1@school.com / teacher123');
  console.log('  Teacher2: teacher2@school.com / teacher123');

  await ds.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
