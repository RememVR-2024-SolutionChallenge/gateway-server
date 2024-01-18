import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CareEnrollRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  // caregiver, carerecipient, cert를 받아서,
  // 30분동안 키-값으로 저장
  async saveCertFor30m(
    giverEmail: string,
    recipientEmail: string,
    cert: string,
  ): Promise<string> {
    const key = `cert:${giverEmail}:${recipientEmail}`;
    return await this.redis.set(key, cert, 'EX', 60 * 30);
  }
}
