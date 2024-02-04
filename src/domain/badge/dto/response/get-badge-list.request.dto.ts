import { ApiProperty, PickType } from '@nestjs/swagger';
import { Badge } from '../../entity/badge.entity';

export class BadgeDto extends PickType(Badge, ['type', 'createdAt'] as const) {
  static of(badge: Badge): BadgeDto {
    return {
      type: badge.type,
      createdAt: badge.createdAt,
    };
  }
}

export class GetBadgeListResponseDto {
  @ApiProperty({ type: [BadgeDto], description: '뱃지 목록' })
  badges: BadgeDto[];

  constructor(badges: BadgeDto[]) {
    this.badges = badges;
  }

  static of(badges: Badge[]): GetBadgeListResponseDto {
    const badgeDtos = badges.map((badge) => BadgeDto.of(badge));
    return new GetBadgeListResponseDto(badgeDtos);
  }
}
