import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { SampleVrResource } from '../entity/sample-vr-resource.entity';

@Injectable()
export class SampleVrResourceRepository extends Repository<SampleVrResource> {
  constructor(
    @InjectRepository(SampleVrResource)
    private readonly repository: Repository<SampleVrResource>,
  ) {
    super(repository.target, repository.manager);
  }

  /** get all `sample vr resource` */
  async find(): Promise<SampleVrResource[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<SampleVrResource> {
    return this.repository.findOne({ where: { id } });
  }
}
