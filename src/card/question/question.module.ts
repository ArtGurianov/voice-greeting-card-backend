import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {CardRepository} from '../card.repository'
import {QuestionRepository} from './question.repository'
import {QuestionResolver} from './question.resolver'
import {QuestionService} from './question.service'

@Module({
  imports: [TypeOrmModule.forFeature([QuestionRepository, CardRepository])],
  providers: [QuestionResolver, QuestionService],
})
export class QuestionModule {}
