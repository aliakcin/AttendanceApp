import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { SchoolClass } from '../classes/entities/class.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(SchoolClass)
    private classesRepo: Repository<SchoolClass>,
  ) {}

  async markAttendance(dto: MarkAttendanceDto, user: any): Promise<{ saved: number }> {
    // Validate date is not in the future
    const today = new Date().toISOString().split('T')[0];
    if (dto.date > today) {
      throw new BadRequestException('Cannot mark attendance for a future date');
    }

    // Verify teacher is assigned to this class (skip for admin)
    if (user.role === 'teacher') {
      const cls = await this.classesRepo
        .createQueryBuilder('c')
        .innerJoin('c.teachers', 't', 't.id = :userId', { userId: user.id })
        .where('c.id = :classId', { classId: dto.classId })
        .getOne();
      if (!cls) {
        throw new ForbiddenException('You are not assigned to this class');
      }
    }

    // Upsert attendance records
    for (const record of dto.records) {
      await this.attendanceRepo
        .createQueryBuilder()
        .insert()
        .into(Attendance)
        .values({
          studentId: record.studentId,
          schoolClassId: dto.classId,
          date: dto.date,
          status: record.status,
          markedById: user.id,
        })
        .orUpdate(['status', 'marked_by', 'updated_at'], [
          'student_id',
          'school_class_id',
          'date',
        ])
        .execute();
    }

    return { saved: dto.records.length };
  }

  async getAttendance(classId: string, date: string, user: any): Promise<Attendance[]> {
    // Verify teacher access
    if (user.role === 'teacher') {
      const cls = await this.classesRepo
        .createQueryBuilder('c')
        .innerJoin('c.teachers', 't', 't.id = :userId', { userId: user.id })
        .where('c.id = :classId', { classId })
        .getOne();
      if (!cls) {
        throw new ForbiddenException('You are not assigned to this class');
      }
    }

    return this.attendanceRepo.find({
      where: { schoolClassId: classId, date },
      relations: ['student'],
      order: { student: { fullName: 'ASC' } },
    });
  }
}
