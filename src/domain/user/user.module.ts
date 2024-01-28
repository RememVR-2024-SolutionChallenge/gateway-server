import { Module } from '@nestjs/common';
import { UserEnrollService } from './service/user-enroll.service';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { EmailModule } from 'src/common/email/email.module';
import { CareEnrollRepository } from './repository/care-enroll.repository';
import { GroupRepository } from '../../group/repository/group.repository';
import { Group } from '../../group/entity/group.entity';
import { UserFetchService } from './service/user-fetch.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group]), EmailModule],
  controllers: [UserController],
  providers: [
    UserEnrollService,
    UserFetchService,
    UserRepository,
    CareEnrollRepository,
    GroupRepository,
  ],
})
export class UserModule {}
