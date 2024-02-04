import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Badge } from '../entity/badge.entity';

@Injectable()
export class BadgeRepository extends Repository<Badge> {
  constructor(
    @InjectRepository(Badge)
    private readonly repository: Repository<Badge>,
  ) {
    super(repository.target, repository.manager);
  }

  async findByGroupId(groupId: string): Promise<Badge[]> {
    return this.repository.find({
      where: { group: { id: groupId } },
    });
  }
}
