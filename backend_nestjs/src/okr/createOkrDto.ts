export class CreateOkrDto {
  objective: string;
  keyResults: KeyResultDto[];
}

export class KeyResultDto {
  id?: string;
  description: string;
  progress: string;
}

export class UpdateOkrDto {
  id: string;
  objective: string;
  keyResults: KeyResultDto[];
}
