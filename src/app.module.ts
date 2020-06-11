import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {AudioModule} from './audio/audio.module'
import appConfig from './config/appConfig'
import {typeOrmConfig} from './typeormConfig'

@Module({
  imports: [
    ConfigModule.forRoot({load: [appConfig]}),
    TypeOrmModule.forRoot(typeOrmConfig),
    AudioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
