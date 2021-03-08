import {
  Inject,
  Injectable,
  LoggerService,
  OnApplicationShutdown,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Connection } from 'typeorm';

@Injectable()
export class AppService implements OnApplicationShutdown {
  public constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @InjectConnection() readonly connection: Connection,
  ) {}

  async onApplicationShutdown(signal: string) {
    await this.connection.close();
    this.logger.log(`Terminated by: ${signal}`);
  }

  getHello(): string {
    return `Welcome to <i><b>voicy.ru</b></i> <s>graphql</s> REST api. You can play with it by sending get/post requests! Have fun :)`;
  }
}
