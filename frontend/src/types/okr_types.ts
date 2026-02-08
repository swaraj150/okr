export type KeyResultState = {
    id: string;
    description: string;
    progress: string;
    toDelete?: boolean;
    toCreate?: boolean;
};

export type OkrState = {
    id: string;
    title: string;
    keyResults: KeyResultState[];
};
