import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './domain/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user/data/entity/user.entity';
import { AuthModule } from './domain/auth/auth.module';
import { EmailModule } from './common/email/email.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CareRelation } from './domain/user/data/entity/care-relation.entity';
import { GcpModule } from './common/gcp/gcp.module';
import { AiModule } from './domain/ai/ai.module';

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
        entities: [User, CareRelation],
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
    EmailModule,
    AiModule,
    GcpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
