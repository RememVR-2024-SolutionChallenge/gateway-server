import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/common/email/email.module';
import { GroupRepository } from '../group/repository/group.repository';
import { Group } from '../group/entity/group.entity';
import { BadgeService } from './badge.service';
import { BadgeRepository } from './repository/badge.repository';
import { BadgeController } from './badge.controller';
import { User } from '../user/entity/user.entity';
import { Badge } from './entity/badge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group, Badge])],
  controllers: [BadgeController],
  providers: [BadgeRepository, BadgeService, GroupRepository],
})
export class BadgeModule {}
