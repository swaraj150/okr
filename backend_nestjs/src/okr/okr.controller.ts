import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { OkrService } from './okr.service';
import { Okr } from './okr.type';
import { CreateOkrDto, UpdateOkrDto } from './createOkrDto';

@Controller('okr')
export class OkrController {
  constructor(private readonly okrService: OkrService) {}
  @Get()
  fetchAll(): Okr[] {
    return this.okrService.fetchAll();
  }
  @Post()
  create(@Body() createOkrReq: CreateOkrDto): Okr[] {
    return this.okrService.create(createOkrReq);
  }
  @Put()
  edit(@Body() updateOkrReq: UpdateOkrDto): Okr[] {
    return this.okrService.edit(updateOkrReq);
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.okrService.delete(id);
  }
}
