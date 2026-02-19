import { CreateKeyResultDto } from '../../key-result/dto/key-result.dto';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateObjectiveDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  keyResults: Omit<CreateKeyResultDto, 'objectiveId'>[];
}

export class UpdateObjectiveDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}
export class GenerateObjectiveDto {
  prompt: string;
}
