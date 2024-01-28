import { Module } from '@nestjs/common';
import { UserEnrollService } from './service/user-enroll.service';
import { UserController } from './user.controller';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { EmailModule } from 'src/common/email/email.module';
import { CareEnrollRepository } from './repository/care-enroll.repository';
import { CareRelationRepository } from './repository/care-relation.repository';
import { CareRelation } from './entity/care-relation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CareRelation]), EmailModule],
  controllers: [UserController],
  providers: [
    UserEnrollService,
    UserRepository,
    CareEnrollRepository,
    CareRelationRepository,
  ],
})
export class UserModule {}
