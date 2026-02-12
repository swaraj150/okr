export type KeyResultState = {
    id: string;
    description: string;
    currentValue: number;
    targetValue: number;
    metricType: string;
    objectiveId?: string;
    toDelete: boolean;
};

export type ObjectiveState = {
    id: string;
    title: string;
    progress: string;
    keyResults: KeyResultState[];
};
