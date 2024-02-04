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

  async findByCareGiverIdWithUsers(giverId: string): Promise<Group> {
    return await this.findOne({
      where: { givers: { id: giverId } },
      relations: ['givers', 'recipient'],
    });
  }

  async findByCareRecipientIdWithUsers(recepientId: string): Promise<Group> {
    return await this.findOne({
      where: { id: recepientId },
      relations: ['givers', 'recipient'],
    });
  }

  async findByCareRecipientId(recepientId: string): Promise<Group> {
    return await this.findOne({
      where: { recipient: { id: recepientId } },
    });
  }
}
