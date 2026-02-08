import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class KeyResultDto {
    id?: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsDefined()
    progress: string;

    toDelete?: boolean;
    toCreate?: boolean;
}
