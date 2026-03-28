import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  studentNumber?: string;
}

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  studentNumber?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
