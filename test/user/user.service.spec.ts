import { Test, TestingModule } from '@nestjs/testing';
import { UserEnrollService } from '../../src/user/service/user-enroll.service';

describe('UserEnrollService', () => {
  let service: UserEnrollService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserEnrollService],
    }).compile();

    service = module.get<UserEnrollService>(UserEnrollService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
