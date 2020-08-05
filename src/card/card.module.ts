import {Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import {AudioModule} from './audio/audio.module'
import {CardRepository} from './card.repository'
import {CardResolver} from './card.resolver'
import {CardService} from './card.service'
import {QuestionRepository} from './question/question.repository'
import {QuestionResolver} from './question/question.resolver'
import {QuestionService} from './question/question.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([CardRepository, QuestionRepository]),
    AudioModule,
  ],
  providers: [
    CardResolver,
    CardService,
    ConfigService,
    QuestionResolver,
    QuestionService,
  ],
})
export class CardModule {}
