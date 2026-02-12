import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { KeyResultService } from './key-result.service';

import {
  CreateKeyResultDto,
  DeleteKeyResultsDto,
  UpdateCurrentValueDto,
  UpdateKeyResultDto,
} from './dto/key-result.dto';
import { KeyResult } from '../../generated/prisma/client';

@Controller('v3/key-result')
export class KeyResultController {
  constructor(private keyResultService: KeyResultService) {}

  @Get(':id')
  private getOne(@Param('id') id: string) {
    return this.keyResultService.getOneById(id);
  }

  @Post()
  private create(@Body() createKeyResultDto: CreateKeyResultDto) {
    return this.keyResultService.create(createKeyResultDto);
  }

  @Put()
  update(@Body() updateKeyResultDto: UpdateKeyResultDto) {
    return this.keyResultService.update(updateKeyResultDto);
  }

  @Patch('/current-value')
  updateCurrentValue(@Body() updateCurrentValueDto: UpdateCurrentValueDto) {
    return this.keyResultService.updateCurrentValue(updateCurrentValueDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.keyResultService.delete(id);
  }
  @Delete()
  deleteAll(@Body() deleteKeyResultsDto: DeleteKeyResultsDto) {
    return this.keyResultService.deleteAll(deleteKeyResultsDto);
  }
}
