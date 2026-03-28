import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateClassDto {
  @IsString()
  name: string;

  @IsString()
  academicYear: string;
}

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  academicYear?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AssignDto {
  @IsUUID()
  teacherId?: string;

  @IsUUID()
  studentId?: string;
}
