import { Test, TestingModule } from '@nestjs/testing';
import { OkrService } from './okr.service';

describe('OkrService', () => {
  let service: OkrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OkrService],
    }).compile();

    service = module.get<OkrService>(OkrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
