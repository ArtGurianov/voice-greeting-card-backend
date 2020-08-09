import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {GqlModuleOptions, GqlOptionsFactory} from '@nestjs/graphql'
import {defaultInsecureKey} from '../utils/constants'

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  public constructor(private readonly configService: ConfigService) {}
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
      //autoSchemaFile: true,
      //path: path.join(process.cwd(), 'src/schema.gql'),
      playground: true,
      context: ({req, res}) => ({
        req,
        res,
      }),
    }
  }
}
