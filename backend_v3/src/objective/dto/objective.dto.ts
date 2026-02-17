import { CreateKeyResultDto } from '../../key-result/dto/key-result.dto';

export class CreateObjectiveDto {
  title: string;
  keyResults: Omit<CreateKeyResultDto, 'objectiveId'>[];
}

export class UpdateObjectiveDto {
  id: string;
  title: string;
}
export class GenerateObjectiveDto {
  prompt: string;
}
