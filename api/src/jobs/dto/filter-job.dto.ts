import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { JobSeniority } from "../enums/job-seniority.enum";
import { JobModality } from "../enums/job-modality.enum";
import { Type } from "class-transformer";

export class FilterJobDto {
  @IsOptional()
  @IsEnum(JobSeniority)
  seniority?: JobSeniority;

  @IsOptional()
  @IsEnum(JobModality)
  modality?: JobModality;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;
}