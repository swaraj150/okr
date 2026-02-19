import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateKeyResultDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  currentValue: number;

  @IsNumber()
  @Min(0)
  targetValue: number;

  @IsString()
  metricType: string;

  @IsUUID()
  objectiveId: string;
}

export class UpdateKeyResultDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  targetValue?: number;

  @IsOptional()
  @IsString()
  metricType?: string;

  @IsUUID()
  objectiveId: string;
}

export class UpdateCurrentValueDto {
  @IsUUID()
  id: string;

  @IsNumber()
  @Min(0)
  currentValue: number;

  @IsUUID()
  objectiveId: string;
}

export class DeleteKeyResultsDto {
  @IsArray()
  keyResultsToDelete: string[];
  @IsUUID()
  objectiveId: string;
}
