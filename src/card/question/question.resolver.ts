import {UseFilters} from '@nestjs/common';
import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CustomResult} from 'src/utils/CustomResult';
import {Public} from 'src/utils/public.decorator';
import validationFilter from 'src/utils/validation.filter';
import {QuestionInput} from './input/question.input';
import {Question} from './question.entity';
import {QuestionService} from './question.service';

@Resolver()
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @Public()
  @Query(() => [Question])
  async getQuestions(@Args('cardId') cardId: string): Promise<Question[]> {
    return await this.questionService.getQuestions(cardId);
  }

  @Public()
  @Mutation(() => CustomResult)
  @UseFilters(validationFilter)
  async saveQuestions(
    @Args('cardId') cardId: string,
    @Args({name: 'questionsInput', type: () => [QuestionInput]})
    questionsInput: QuestionInput[],
  ): Promise<CustomResult> {
    return await this.questionService.saveQuestions(cardId, questionsInput);
  }
}
