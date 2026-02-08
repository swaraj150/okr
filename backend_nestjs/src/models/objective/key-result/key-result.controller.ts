import { Controller, Put } from '@nestjs/common';
import { KeyResultService } from './key-result.service';
import { KeyResultDto } from './dto/key-result.dto';

@Controller()
export class KeyResultController {
    constructor(private readonly keyResultService: KeyResultService) {}

    @Put()
    update(updateKeyResultDto: KeyResultDto) {
        return this.keyResultService.update(updateKeyResultDto);
    }
}
