import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { baseValidationPipe } from '../../utils/baseValidationPipe';
import { CustomResult } from '../../utils/CustomResult';
import { Public } from '../../utils/public.decorator';
import { QuestionInput } from './input/question.input';
import { Question } from './question.entity';
import { QuestionService } from './question.service';

@ApiTags('question')
@Controller('/question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Public()
  @Get('/:cardId')
  async getQuestions(@Param('cardId') cardId: string): Promise<Question[]> {
    return await this.questionService.getQuestions(cardId);
  }

  @Public()
  @Post('/saveQuestions/:cardId')
  async saveQuestions(
    @Param('cardId') cardId: string,
    @Body('questionsInput', baseValidationPipe)
    questionsInput: QuestionInput[],
  ): Promise<CustomResult> {
    return await this.questionService.saveQuestions(cardId, questionsInput);
  }
}
