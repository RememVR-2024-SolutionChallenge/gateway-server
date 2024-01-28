import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Group } from '../entity/group.entity';

@Injectable()
export class GroupRepository extends Repository<Group> {
  constructor(
    @InjectRepository(Group)
    private readonly repository: Repository<Group>,
  ) {
    super(repository.target, repository.manager);
  }
}
