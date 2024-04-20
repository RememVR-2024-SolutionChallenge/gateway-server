import { Module } from '@nestjs/common';
import { UserEnrollService } from './service/user-enroll.service';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { EmailModule } from 'src/common/email/email.module';
import { CareEnrollRepository } from './repository/care-enroll.repository';
import { Group } from '../group/entity/group.entity';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group]), EmailModule, GroupModule],
  controllers: [UserController],
  providers: [UserEnrollService, UserRepository, CareEnrollRepository],
  exports: [UserRepository],
})
export class UserModule {}
