import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ObjectiveService } from './objective.service';
import {
  CreateObjectiveDto,
  GenerateObjectiveDto,
  UpdateObjectiveDto,
} from './dto/objective.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('v3/objective')
export class ObjectiveController {
  constructor(private readonly objectiveService: ObjectiveService) {}
  @Get()
  @ApiOperation({
    summary: 'Get all objectives',
    description:
      'Returns all objectives ordered by creation date, each including their key results.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all objectives with key results.',
  })
  getAll() {
    return this.objectiveService.getAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an objective by ID',
    description:
      'Returns a single objective and its key results. Returns null if not found.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the objective',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'The objective matching the given ID.',
  })
  getOneById(@Param('id') id: string) {
    return this.objectiveService.getOneById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create an objective',
    description:
      'Creates a new objective with optional key results. An objective with no key results is immediately marked as completed.',
  })
  @ApiBody({ type: CreateObjectiveDto })
  @ApiResponse({
    status: 201,
    description: 'The created objective with its key results.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed — missing or invalid fields.',
  })
  create(@Body() createObjectiveDto: CreateObjectiveDto) {
    return this.objectiveService.create(createObjectiveDto);
  }

  @Post('/generate')
  @ApiOperation({
    summary: 'Generate an objective using AI',
    description:
      'Uses an AI model to generate an objective and key results from a free-text prompt, then persists the result.',
  })
  @ApiBody({ type: GenerateObjectiveDto })
  @ApiResponse({
    status: 201,
    description: 'The AI-generated objective with key results.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed — prompt is missing or empty.',
  })
  generateOkr(@Body() req: GenerateObjectiveDto) {
    return this.objectiveService.generate(req.prompt);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an objective',
    description:
      'Updates the title of an existing objective identified by its ID.',
  })
  @ApiBody({ type: UpdateObjectiveDto })
  @ApiResponse({ status: 200, description: 'The updated objective.' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the objective to update',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed — missing or invalid fields.',
  })
  update(
    @Param('id') id: string,
    @Body() updateObjectiveDto: UpdateObjectiveDto,
  ) {
    return this.objectiveService.update(updateObjectiveDto, id);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete an objective',
    description: 'Deletes an objective and its associated key results by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the objective to delete',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({ status: 200, description: 'The deleted objective.' })
  delete(@Param('id') id: string) {
    return this.objectiveService.delete(id);
  }
}
