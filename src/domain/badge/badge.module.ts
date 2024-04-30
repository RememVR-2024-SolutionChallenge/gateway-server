import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../group/entity/group.entity';
import { BadgeService } from './service/badge.service';
import { BadgeRepository } from './repository/badge.repository';
import { BadgeController } from './badge.controller';
import { User } from '../user/entity/user.entity';
import { Badge } from './entity/badge.entity';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group, Badge]), GroupModule],
  controllers: [BadgeController],
  providers: [BadgeRepository, BadgeService],
})
export class BadgeModule {}
