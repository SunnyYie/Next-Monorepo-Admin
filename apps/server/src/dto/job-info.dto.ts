import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobInfoDto {
  @IsString()
  @IsNotEmpty()
  jobName: string;

  @IsString()
  @IsNotEmpty()
  salaryDesc: string;

  @IsArray()
  @IsString({ each: true })
  jobLabels: string[];

  @IsInt()
  jobValidStatus: number;

  @IsOptional()
  @IsString()
  iconWord?: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsOptional()
  @IsString()
  jobDegree?: string;

  @IsOptional()
  @IsString()
  cityName?: string;

  @IsString()
  @IsNotEmpty()
  brandName: string;

  @IsOptional()
  @IsString()
  brandIndustry?: string;

  @IsOptional()
  @IsString()
  brandScaleName?: string;

  @IsArray()
  @IsString({ each: true })
  welfareList: string[];

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  dataDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateJobInfoDto {
  @IsOptional()
  @IsString()
  jobName?: string;

  @IsOptional()
  @IsString()
  salaryDesc?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  jobLabels?: string[];

  @IsOptional()
  @IsInt()
  jobValidStatus?: number;

  @IsOptional()
  @IsString()
  iconWord?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  jobDegree?: string;

  @IsOptional()
  @IsString()
  cityName?: string;

  @IsOptional()
  @IsString()
  brandName?: string;

  @IsOptional()
  @IsString()
  brandIndustry?: string;

  @IsOptional()
  @IsString()
  brandScaleName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  welfareList?: string[];

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  dataDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class QueryJobInfoDto {
  @IsOptional()
  @IsString()
  jobName?: string;

  @IsOptional()
  @IsString()
  brandName?: string;

  @IsOptional()
  @IsString()
  cityName?: string;

  @IsOptional()
  @IsString()
  brandIndustry?: string;

  @IsOptional()
  @IsString()
  salaryMin?: string;

  @IsOptional()
  @IsString()
  salaryMax?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  dataDate?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class BatchCreateJobInfoDto {
  @IsArray()
  @Type(() => CreateJobInfoDto)
  jobs: CreateJobInfoDto[];
}

export class BatchDeleteJobInfoDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
