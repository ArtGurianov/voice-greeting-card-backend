import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {APP_GUARD} from '@nestjs/core'
import {TypeOrmModule} from '@nestjs/typeorm'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {AudioModule} from './audio/audio.module'
import appConfig from './config/appConfig'
import {JwtService} from './jwt/jwt.service'
import {typeOrmConfig} from './typeormConfig'
import {UserModule} from './user/user.module'
import {RolesGuard} from './utils/roles.guard'

@Module({
  imports: [
    ConfigModule.forRoot({load: [appConfig]}),
    TypeOrmModule.forRoot(typeOrmConfig),
    AudioModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {provide: APP_GUARD, useClass: RolesGuard},
  ],
})
export class AppModule {}
