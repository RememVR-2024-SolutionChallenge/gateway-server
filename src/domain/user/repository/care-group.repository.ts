import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CareGroup } from '../../../group/entities/care-group.entity';

@Injectable()
export class CareGroupRepository extends Repository<CareGroup> {
  constructor(
    @InjectRepository(CareGroup)
    private readonly repository: Repository<CareGroup>,
  ) {
    super(repository.target, repository.manager);
  }
}
