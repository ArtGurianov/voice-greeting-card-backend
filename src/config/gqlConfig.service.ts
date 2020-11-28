import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {GqlModuleOptions, GqlOptionsFactory} from '@nestjs/graphql';
import {defaultInsecureKey} from '../utils/constants';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  public constructor(private readonly configService: ConfigService) {
    //this.nodeEnv = configService.get<string>('nodeEnv', defaultInsecureKey)
  }
  //private readonly nodeEnv: string
  createGqlOptions(): GqlModuleOptions {
    return {
      cors: {
        origin: this.configService.get<string>(
          'frontendHostUrl',
          defaultInsecureKey,
        ),
        credentials: true,
      },
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      playground: true, //this.nodeEnv === 'development' ? true : false,
      context: ({req, res}) => ({
        req,
        res,
      }),
    };
  }
}
