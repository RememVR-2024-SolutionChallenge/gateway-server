import { Module } from '@nestjs/common';
import { UserEnrollService } from './user-enroll.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserEnrollService, UserRepository],
})
export class UserModule {}
