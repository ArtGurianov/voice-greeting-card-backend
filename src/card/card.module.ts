import {Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import {CardRepository} from './card.repository'
import {CardResolver} from './card.resolver'
import {CardService} from './card.service'

@Module({
  imports: [TypeOrmModule.forFeature([CardRepository])],
  providers: [CardResolver, CardService, ConfigService],
})
export class CardModule {}
