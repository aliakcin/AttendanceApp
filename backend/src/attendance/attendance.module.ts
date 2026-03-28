import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { SchoolClass } from '../classes/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, SchoolClass])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
