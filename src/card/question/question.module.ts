import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardRepository } from 'src/card/card.repository';
import { QuestionController } from './question.controller';
import { QuestionRepository } from './question.repository';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionRepository, CardRepository])],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
