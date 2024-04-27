import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { VrVideo } from '../entity/vr-video.entity';
import { VrResource } from 'src/domain/vr-resource/entity/vr-resource.entity';
import { Group } from 'src/domain/group/entity/group.entity';

@Injectable()
export class VrVideoRepository extends Repository<VrVideo> {
  constructor(
    @InjectRepository(VrVideo)
    private readonly repository: Repository<VrVideo>,
  ) {
    super(repository.target, repository.manager);
  }

  async findByGroupIdWithResources(groupId: string): Promise<VrVideo[]> {
    return this.repository.find({
      where: { group: { id: groupId } },
      relations: ['scene', 'avatars'],
    });
  }

  async findById(videoId: string): Promise<VrVideo> {
    return this.repository.findOne({
      where: { id: videoId },
      relations: ['scene', 'avatars'],
    });
  }
}
