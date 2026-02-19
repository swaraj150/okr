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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { KeyResultService } from './key-result.service';
import {
  CreateKeyResultDto,
  DeleteKeyResultsDto,
  UpdateCurrentValueDto,
  UpdateKeyResultDto,
} from './dto/key-result.dto';

const OBJECTIVE_ID_PARAM = {
  name: 'objectiveId',
  description: 'UUID of the parent objective',
  example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
};

const KEY_RESULT_ID_PARAM = {
  name: 'id',
  description: 'UUID of the key result',
  example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
};

@ApiTags('Key Results')
@ApiParam(OBJECTIVE_ID_PARAM)
@Controller('v3/objective/:objectiveId/key-result')
export class KeyResultController {
  constructor(private keyResultService: KeyResultService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a key result by ID', description: 'Returns a single key result belonging to the specified objective.' })
  @ApiParam(KEY_RESULT_ID_PARAM)
  @ApiResponse({ status: 200, description: 'The key result matching the given ID.' })
  private getOne(
    @Param('id') id: string,
    @Param('objectiveId') objectiveId: string,
  ) {
    return this.keyResultService.getOneById({ keyResultId: id, objectiveId });
  }

  @Post()
  @ApiOperation({ summary: 'Create a key result', description: 'Creates a new key result and attaches it to the specified objective. Progress is recalculated automatically.' })
  @ApiBody({ type: CreateKeyResultDto })
  @ApiResponse({ status: 201, description: 'The created key result.' })
  @ApiResponse({ status: 400, description: 'Validation failed — missing or invalid fields.' })
  private create(@Body() createKeyResultDto: CreateKeyResultDto) {
    return this.keyResultService.create(createKeyResultDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a key result', description: 'Updates one or more fields of an existing key result. If currentValue is updated, the parent objective\'s progress is recalculated.' })
  @ApiParam(KEY_RESULT_ID_PARAM)
  @ApiBody({ type: UpdateKeyResultDto })
  @ApiResponse({ status: 200, description: 'The key result was updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed — missing or invalid fields.' })
  update(
    @Param('id') id: string,
    @Param('objectiveId') objectiveId: string,
    @Body() updateKeyResultDto: UpdateKeyResultDto,
  ) {
    return this.keyResultService.update(updateKeyResultDto, {
      keyResultId: id,
      objectiveId,
    });
  }

  @Patch(':id/current-value')
  @ApiOperation({ summary: 'Update the current value of a key result', description: 'Patches only the currentValue field and immediately triggers an async recalculation of the parent objective\'s overall progress and completion status.' })
  @ApiParam(KEY_RESULT_ID_PARAM)
  @ApiBody({ type: UpdateCurrentValueDto })
  @ApiResponse({ status: 200, description: 'Current value updated and objective progress recalculated.' })
  @ApiResponse({ status: 400, description: 'Validation failed — currentValue must be a number ≥ 0.' })
  updateCurrentValue(
    @Param('id') id: string,
    @Param('objectiveId') objectiveId: string,
    @Body() updateCurrentValueDto: UpdateCurrentValueDto,
  ) {
    return this.keyResultService.updateCurrentValue(updateCurrentValueDto, {
      keyResultId: id,
      objectiveId,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a key result', description: 'Deletes a single key result from the specified objective.' })
  @ApiParam(KEY_RESULT_ID_PARAM)
  @ApiResponse({ status: 200, description: 'The key result was deleted successfully.' })
  delete(@Param('id') id: string, @Param('objectiveId') objectiveId: string) {
    return this.keyResultService.delete({ keyResultId: id, objectiveId });
  }

  @Delete()
  @ApiOperation({ summary: 'Delete multiple key results', description: 'Deletes a batch of key results from the specified objective in a single operation.' })
  @ApiBody({ type: DeleteKeyResultsDto })
  @ApiResponse({ status: 200, description: 'The specified key results were deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed — keyResultsToDelete must be an array of UUIDs.' })
  deleteAll(
    @Body() deleteKeyResultsDto: DeleteKeyResultsDto,
    @Param('objectiveId') objectiveId: string,
  ) {
    return this.keyResultService.deleteAll(deleteKeyResultsDto, {
      keyResultId: '',
      objectiveId,
    });
  }
}