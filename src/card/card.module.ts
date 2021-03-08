import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioModule } from './audio/audio.module';
import { CardController } from './card.controller';
import { CardRepository } from './card.repository';
import { CardService } from './card.service';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardRepository]),
    AudioModule,
    QuestionModule,
  ],
  providers: [CardService],
  controllers: [CardController],
})
export class CardModule {}
