import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CareRelation } from '../../entity/care-relation.entity';

@Injectable()
export class CareRelationRepository extends Repository<CareRelation> {
  constructor(
    @InjectRepository(CareRelation)
    private readonly repository: Repository<CareRelation>,
  ) {
    super(repository.target, repository.manager);
  }
}
