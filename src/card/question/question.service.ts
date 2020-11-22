import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CustomError, CustomResult} from '../../utils/CustomResult';
import {CardRepository} from '../card.repository';
import {Question} from './question.entity';
import {QuestionRepository} from './question.repository';

@Injectable()
export class QuestionService {
  public constructor(
    @InjectRepository(QuestionRepository)
    private readonly questionRepo: QuestionRepository,
    @InjectRepository(CardRepository)
    private readonly cardRepo: CardRepository,
  ) {}

  async getQuestions(cardId: string): Promise<Question[]> {
    const questions = await this.questionRepo.find({where: {cardId}});
    if (!questions) throw new NotFoundException();
    return questions;
  }

  async saveQuestions(
    cardId: string,
    questions: {options: string[]; answer: string}[],
  ): Promise<CustomResult> {
    const card = await this.cardRepo.findOne({id: cardId});
    if (!card) throw new NotFoundException();
    if (card.isActivatedQuestions)
      return new CustomResult({
        errors: [
          new CustomError({
            location: 'Card',
            errorMessages: ['This card has already been activated'],
          }),
        ],
      });

    const savedQuestions = await this.questionRepo.save(
      questions.map(q => ({...q, cardId})),
    );

    if (!savedQuestions) throw new InternalServerErrorException();

    const activatedCard = await this.cardRepo.save({
      ...card,
      isActivatedQuestions: true,
    });

    if (!activatedCard) throw new InternalServerErrorException();

    return new CustomResult({ok: true});
  }
}
