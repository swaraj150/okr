import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateKeyResultDto {
  @ApiProperty({ example: 'Reach 1000 active users', description: 'What this key result measures' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 0, description: 'The starting value', minimum: 0 })
  @IsNumber()
  @Min(0)
  currentValue: number;

  @ApiProperty({ example: 1000, description: 'The target value to reach for completion', minimum: 0 })
  @IsNumber()
  @Min(0)
  targetValue: number;

  @ApiProperty({ example: 'NUMBER', description: 'How the value is measured (e.g. NUMBER, PERCENTAGE, CURRENCY, BOOLEAN)' })
  @IsString()
  metricType: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'UUID of the parent objective' })
  @IsUUID()
  objectiveId: string;
}

export class UpdateKeyResultDto {
  @ApiPropertyOptional({ example: 'Reach 2000 active users', description: 'Updated description' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({ example: 500, description: 'Updated current value', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentValue?: number;

  @ApiPropertyOptional({ example: 2000, description: 'Updated target value', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  targetValue?: number;

  @ApiPropertyOptional({ example: 'PERCENTAGE', description: 'Updated metric type' })
  @IsOptional()
  @IsString()
  metricType?: string;
}

export class UpdateCurrentValueDto {
  @ApiProperty({ example: 750, description: 'The new current value for the key result', minimum: 0 })
  @IsNumber()
  @Min(0)
  currentValue: number;
}

export class DeleteKeyResultsDto {
  @ApiProperty({
    type: [String],
    example: ['a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'],
    description: 'List of key result UUIDs to delete',
  })
  @IsArray()
  keyResultsToDelete: string[];
}