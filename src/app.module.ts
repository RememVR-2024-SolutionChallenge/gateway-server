import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './domain/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user/entity/user.entity';
import { AuthModule } from './domain/auth/auth.module';
import { EmailModule } from './common/email/email.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Group } from './domain/group/entity/group.entity';
import { GcpModule } from './common/gcp/gcp.module';
import { VrResourceModule } from './domain/vr-resource/vr-resource.module';
import { GroupModule } from './domain/group/group.module';
import { BadgeModule } from './domain/badge/badge.module';
import { Badge } from './domain/badge/entity/badge.entity';
import { VrResource } from './domain/vr-resource/entity/vr-resource.entity';
import { VrVideo } from './domain/vr-video/entity/vr-video.entity';
import { VrVideoModule } from './domain/vr-video/vr-video.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Group, Badge, VrResource, VrVideo],
        migrations: [__dirname + '/src/migrations/*.ts'],
        autoLoadEntities: true,
        charset: 'utf8mb4',
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') !== 'production',
        keepConnectionAlive: true,
      }),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        closeClient: true,
        config: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          username: configService.get<string>('REDIS_USERNAME'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    UserModule,
    AuthModule,
    BadgeModule,
    EmailModule,
    VrResourceModule,
    VrVideoModule,
    GcpModule,
    GroupModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
