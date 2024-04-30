import { Module } from '@nestjs/common';
import { GroupService } from './service/group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Group } from './entity/group.entity';
import { GroupRepository } from './repository/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User])],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
  exports: [GroupService, GroupRepository],
})
export class GroupModule {}
