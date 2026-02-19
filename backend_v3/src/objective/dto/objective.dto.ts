import { CreateKeyResultDto } from '../../key-result/dto/key-result.dto';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateObjectiveDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Grow the user base',
    description: 'The title of the objective',
  })
  title: string;

  @ApiProperty({
    description:
      'List of key results. Pass an empty array to create an objective with no key results (auto-completed).',
    example: [
      {
        description: 'Reach 1000 users',
        currentValue: 0,
        targetValue: 1000,
        metricType: 'NUMBER',
      },
    ],
  })
  keyResults: Omit<CreateKeyResultDto, 'objectiveId'>[];
}

export class UpdateObjectiveDto {
  @IsString()
  @ApiProperty({
    example: 'Grow the user base to 10k',
    description: 'The updated title',
  })
  @IsNotEmpty()
  title: string;
}
export class GenerateObjectiveDto {
  @ApiProperty({
    example:
      'We want to improve our onboarding experience so more users complete setup',
    description:
      'Free-text prompt describing the goal. The AI will generate a structured objective and key results from this.',
  })
  prompt: string;
}
