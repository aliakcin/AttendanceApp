import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto, UpdateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepo: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentsRepo.find({
      where: { isActive: true },
      order: { fullName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentsRepo.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async create(dto: CreateStudentDto): Promise<Student> {
    if (dto.studentNumber) {
      const exists = await this.studentsRepo.findOne({
        where: { studentNumber: dto.studentNumber },
      });
      if (exists) throw new ConflictException('Student number already exists');
    }
    const student = this.studentsRepo.create(dto);
    return this.studentsRepo.save(student);
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    Object.assign(student, dto);
    return this.studentsRepo.save(student);
  }

  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    student.isActive = false;
    await this.studentsRepo.save(student);
  }
}
