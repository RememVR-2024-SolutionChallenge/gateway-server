import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { VrResource } from '../entity/vr-resource.entity';

@Injectable()
export class VrResourceRepository extends Repository<VrResource> {
  constructor(
    @InjectRepository(VrResource)
    private readonly repository: Repository<VrResource>,
  ) {
    super(repository.target, repository.manager);
  }

  async findSamples(): Promise<VrResource[]> {
    return this.repository.find({
      where: { isSample: true },
    });
  }

  async findByGroupId(groupId: string): Promise<VrResource[]> {
    return this.repository.find({
      where: { group: { id: groupId } },
    });
  }

  async findById(id: string): Promise<VrResource> {
    return this.repository.findOne({ where: { id }, relations: ['group'] });
  }

  async findByIdAndGroupId(id: string, groupId: string): Promise<VrResource> {
    return this.repository.findOne({
      where: { id, group: { id: groupId } },
    });
  }
}
