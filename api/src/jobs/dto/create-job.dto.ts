import { IsString, IsArray, IsEnum } from 'class-validator';
import { JobModality } from '../enums/job-modality.enum';
import { JobSeniority } from '../enums/job-seniority.enum';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @IsArray()
  @IsString({ each: true })
  stack: string[];

  @IsEnum(JobModality)
  modality: JobModality;

  @IsString()
  salary: string;

  @IsEnum(JobSeniority)
  seniority: JobSeniority;

  @IsString()
  location: string;
}