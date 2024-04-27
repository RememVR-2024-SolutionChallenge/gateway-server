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

  async isUserInGroup(userId: string, groupId: string): Promise<boolean> {
    // 1. is the user careRecipient?
    const isCareRecipient =
      (
        await this.findOne({
          where: { recipient: { id: userId } },
        })
      )?.id === groupId
        ? true
        : false;

    // 2. is the user careGiver?
    const isCareGiver =
      (
        await this.findOne({
          where: { givers: { id: userId } },
        })
      )?.id === groupId
        ? true
        : false;

    return isCareRecipient || isCareGiver ? true : false;
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

  async findByCareGiverId(giverId: string): Promise<Group> {
    return await this.findOne({
      where: { givers: { id: giverId } },
    });
  }

  async findByCareRecipientId(recepientId: string): Promise<Group> {
    return await this.findOne({
      where: { recipient: { id: recepientId } },
    });
  }
}
