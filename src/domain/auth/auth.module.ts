import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/domain/user/entity/user.entity';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/domain/user/user.repository';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.JWT_SECRET_KEY,
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [GoogleStrategy, JwtStrategy, AuthService, UserRepository],
})
export class AuthModule {}
