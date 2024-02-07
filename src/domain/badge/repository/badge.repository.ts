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

  async findByGroupIdDuingYearAndMonth(
    groupId: string,
    year: number,
    month: number,
  ): Promise<Badge[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.repository
      .createQueryBuilder('badge')
      .innerJoinAndSelect('badge.group', 'group')
      .where('group.id = :groupId', { groupId })
      .andWhere('badge.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getMany();
  }

  async findByGroupIdAndDate(
    groupId: string,
    date: Date,
  ): Promise<Badge | null> {
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
    );

    return this.repository
      .createQueryBuilder('badge')
      .innerJoinAndSelect('badge.group', 'group')
      .where('group.id = :groupId', { groupId })
      .andWhere('badge.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getOne();
  }

  async findByGroupId(groupId: string): Promise<Badge[]> {
    return this.repository.find({
      where: { group: { id: groupId } },
    });
  }
}
