import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {AudioModule} from './audio/audio.module'
import {CardRepository} from './card.repository'
import {CardResolver} from './card.resolver'
import {CardService} from './card.service'
import {QuestionModule} from './question/question.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([CardRepository]),
    AudioModule,
    QuestionModule,
  ],
  providers: [CardResolver, CardService],
})
export class CardModule {}
