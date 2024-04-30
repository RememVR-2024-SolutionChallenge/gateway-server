import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AiTaskQueueRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async queueRequest(requestId: string): Promise<number> {
    const KEY = 'ai-queue';
    return await this.redis.rpush(KEY, requestId);
  }
}
