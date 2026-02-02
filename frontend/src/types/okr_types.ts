export type KeyResult = {
    id: string;
    description: string;
    progress: string;
};

export type Okr = {
    id: string;
    objective: string;
    keyResults: KeyResult[];
};
