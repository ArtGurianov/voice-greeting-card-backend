import {Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import {CardController} from './card.controller'
import {CardRepository} from './card.repository'
import {CardService} from './card.service'

@Module({
  imports: [TypeOrmModule.forFeature([CardRepository])],
  providers: [CardService, ConfigService],
  controllers: [CardController],
})
export class CardModule {}
