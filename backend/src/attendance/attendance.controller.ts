import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  mark(@Body() dto: MarkAttendanceDto, @Request() req: any) {
    return this.attendanceService.markAttendance(dto, req.user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  get(
    @Query('classId') classId: string,
    @Query('date') date: string,
    @Request() req: any,
  ) {
    return this.attendanceService.getAttendance(classId, date, req.user);
  }
}
