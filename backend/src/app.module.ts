import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'meteakcin',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'attendance_db',
      autoLoadEntities: true,
      synchronize: true, // dev only — use migrations in production
    }),
    AuthModule,
    UsersModule,
    ClassesModule,
    StudentsModule,
    AttendanceModule,
  ],
})
export class AppModule {}
