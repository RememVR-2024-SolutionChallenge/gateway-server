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

  async createVrVideo(
    id: string,
    title: string,
    scene: VrResource,
    avatars: VrResource[],
    isSample: boolean,
    group?: Group,
  ): Promise<VrVideo> {
    const vrVideo = new VrVideo();
    vrVideo.id = id;
    vrVideo.title = title;
    vrVideo.scene = scene;
    vrVideo.avatars = avatars;
    vrVideo.isSample = isSample;
    if (group) vrVideo.group = group;
    return this.repository.save(vrVideo);
  }

  async findById(videoId: string): Promise<VrVideo> {
    return this.repository.findOne({
      where: { id: videoId },
      relations: ['scene', 'avatars', 'group'],
    });
  }

  async findSamples(): Promise<VrVideo[]> {
    return this.repository.find({
      where: { isSample: true },
      relations: ['scene', 'avatars'],
    });
  }
}
