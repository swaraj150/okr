import { Test, TestingModule } from '@nestjs/testing';
import { OkrController } from './okr.controller';

describe('OkrController', () => {
  let controller: OkrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OkrController],
    }).compile();

    controller = module.get<OkrController>(OkrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
