import { Module } from '@nestjs/common';
import { UserEnrollService } from './service/user-enroll.service';
import { UserController } from './user.controller';
import { User } from './data/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './data/repository/main/user.repository';
import { EmailModule } from 'src/common/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule],
  controllers: [UserController],
  providers: [UserEnrollService, UserRepository],
})
export class UserModule {}
