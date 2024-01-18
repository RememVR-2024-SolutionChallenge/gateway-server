import { Module } from '@nestjs/common';
import { UserEnrollService } from './service/user-enroll.service';
import { UserController } from './user.controller';
import { User } from './data/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './data/repository/main/user.repository';
import { EmailModule } from 'src/common/email/email.module';
import { CareEnrollRepository } from './data/repository/in-memory/care-enroll.repository';
import { CareRelationRepository } from './data/repository/main/care-relation.repository';
import { CareRelation } from './data/entity/care-relation.entity';

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
