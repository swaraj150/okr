export class CreateKeyResultDto {
  description: string;
  currentValue: number;
  targetValue: number;
  metricType: string;
  objectiveId: string;
}

export class UpdateKeyResultDto {
  id: string;
  description?: string;
  currentValue?: number;
  targetValue?: number;
  metricType?: string;
  objectiveId: string;
}

export class UpdateCurrentValueDto {
  id: string;
  currentValue: number;
  objectiveId: string;
}

export class DeleteKeyResultsDto {
  keyResultsToDelete: string[];
  objectiveId: string;
}
