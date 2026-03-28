import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolClass } from './entities/class.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { CreateClassDto, UpdateClassDto } from './dto/create-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(SchoolClass)
    private classesRepo: Repository<SchoolClass>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Student)
    private studentsRepo: Repository<Student>,
  ) {}

  async findAll(user: any): Promise<SchoolClass[]> {
    if (user.role === UserRole.ADMIN) {
      return this.classesRepo.find({
        where: { isActive: true },
        order: { name: 'ASC' },
      });
    }
    // Teacher: only assigned classes
    return this.classesRepo
      .createQueryBuilder('c')
      .innerJoin('c.teachers', 't', 't.id = :userId', { userId: user.id })
      .where('c.isActive = true')
      .orderBy('c.name', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<SchoolClass> {
    const cls = await this.classesRepo.findOne({
      where: { id },
      relations: ['teachers', 'students'],
    });
    if (!cls) throw new NotFoundException('Class not found');
    return cls;
  }

  async create(dto: CreateClassDto): Promise<SchoolClass> {
    const cls = this.classesRepo.create(dto);
    return this.classesRepo.save(cls);
  }

  async update(id: string, dto: UpdateClassDto): Promise<SchoolClass> {
    const cls = await this.findOne(id);
    Object.assign(cls, dto);
    return this.classesRepo.save(cls);
  }

  async remove(id: string): Promise<void> {
    const cls = await this.findOne(id);
    cls.isActive = false;
    await this.classesRepo.save(cls);
  }

  async getStudents(id: string): Promise<Student[]> {
    const cls = await this.classesRepo.findOne({
      where: { id },
      relations: ['students'],
    });
    if (!cls) throw new NotFoundException('Class not found');
    return cls.students.filter((s) => s.isActive);
  }

  async assignTeacher(classId: string, teacherId: string): Promise<void> {
    const cls = await this.findOne(classId);
    const teacher = await this.usersRepo.findOne({
      where: { id: teacherId, role: UserRole.TEACHER },
    });
    if (!teacher) throw new NotFoundException('Teacher not found');
    if (!cls.teachers) cls.teachers = [];
    if (!cls.teachers.find((t) => t.id === teacherId)) {
      cls.teachers.push(teacher);
      await this.classesRepo.save(cls);
    }
  }

  async removeTeacher(classId: string, teacherId: string): Promise<void> {
    const cls = await this.findOne(classId);
    cls.teachers = cls.teachers.filter((t) => t.id !== teacherId);
    await this.classesRepo.save(cls);
  }

  async assignStudent(classId: string, studentId: string): Promise<void> {
    const cls = await this.findOne(classId);
    const student = await this.studentsRepo.findOne({
      where: { id: studentId },
    });
    if (!student) throw new NotFoundException('Student not found');
    if (!cls.students) cls.students = [];
    if (!cls.students.find((s) => s.id === studentId)) {
      cls.students.push(student);
      await this.classesRepo.save(cls);
    }
  }

  async removeStudent(classId: string, studentId: string): Promise<void> {
    const cls = await this.findOne(classId);
    cls.students = cls.students.filter((s) => s.id !== studentId);
    await this.classesRepo.save(cls);
  }
}
