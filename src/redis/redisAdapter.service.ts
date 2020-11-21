import {Injectable} from '@nestjs/common';
import * as Redis from 'ioredis';
import {RedisService} from 'nestjs-redis';

@Injectable()
export class RedisServiceAdapter {
  private client: Redis.Redis

  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getClient();
  }

  public async set(
    key: string,
    value: string,
    time?: number | string,
    //expiryMode?: string | any[],
    //setMode?: number | string,
  ): Promise<string | null> {
    if (time) {
      return await this.client.set(key, value, 'EX', time);
    }
    return await this.client.set(key, value);
  }

  public async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  public async del(key: string): Promise<number> {
    return await this.client.del(key);
  }
}
