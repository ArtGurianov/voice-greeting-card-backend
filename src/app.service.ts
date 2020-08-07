import {Injectable, OnApplicationShutdown} from '@nestjs/common'
import {Logger} from 'nestjs-pino'

@Injectable()
export class AppService implements OnApplicationShutdown {
  public constructor(private readonly logger: Logger) {}

  async onApplicationShutdown(signal: string) {
    this.logger.log(`Terminated by: ${signal}`)
  }

  getHello(): string {
    return 'Hello World!'
  }
}
