import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto, UpdateClassDto } from './dto/create-class.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findAll(@Request() req: any) {
    return this.classesService.findAll(req.user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Get(':id/students')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  getStudents(@Param('id') id: string) {
    return this.classesService.getStudents(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateClassDto) {
    return this.classesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }

  @Post(':id/teachers')
  @Roles(UserRole.ADMIN)
  assignTeacher(@Param('id') id: string, @Body('teacherId') teacherId: string) {
    return this.classesService.assignTeacher(id, teacherId);
  }

  @Delete(':id/teachers/:teacherId')
  @Roles(UserRole.ADMIN)
  removeTeacher(
    @Param('id') id: string,
    @Param('teacherId') teacherId: string,
  ) {
    return this.classesService.removeTeacher(id, teacherId);
  }

  @Post(':id/students')
  @Roles(UserRole.ADMIN)
  assignStudent(@Param('id') id: string, @Body('studentId') studentId: string) {
    return this.classesService.assignStudent(id, studentId);
  }

  @Delete(':id/students/:studentId')
  @Roles(UserRole.ADMIN)
  removeStudent(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ) {
    return this.classesService.removeStudent(id, studentId);
  }
}
