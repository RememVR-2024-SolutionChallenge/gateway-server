import { BadRequestException, Injectable } from '@nestjs/common';
import { BadgeRepository } from './repository/badge.repository';
import { User } from '../user/entity/user.entity';
import { GroupRepository } from '../group/repository/group.repository';
import { Badge } from './entity/badge.entity';
import { GroupService } from '../group/group.service';

@Injectable()
export class BadgeService {
  constructor(
    private readonly badgeRepository: BadgeRepository,
    private readonly groupRepository: GroupRepository,
    private readonly groupService: GroupService,
  ) {}

  async giveBadge(user: User): Promise<void> {
    // 그룹 검색
    const group = await this.groupRepository.findByCareRecipientId(user.id);

    // 뱃지가 이미 존재하는 경우
    const todayBadge = await this.badgeRepository.findByGroupIdAndDate(
      group.id,
      new Date(),
    );
    if (todayBadge)
      throw new BadRequestException('오늘의 뱃지를 이미 받으셨습니다.');

    //뱃지 부여
    const badge = new Badge();
    const types: ('GREAT_JOB' | 'EXCELLENT_WORK' | 'LOVELY')[] = [
      'GREAT_JOB',
      'EXCELLENT_WORK',
      'LOVELY',
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    badge.type = type;
    badge.group = group;
    await this.badgeRepository.save(badge);
    return;
  }

  async getBadgeList(
    user: User,
    year: number,
    month: number,
  ): Promise<Badge[]> {
    const groupId = (await this.groupService.getMyGroup(user)).id;
    return await this.badgeRepository.findByGroupIdDuingYearAndMonth(
      groupId,
      year,
      month,
    );
  }
}
