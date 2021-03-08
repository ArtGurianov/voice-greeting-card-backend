import { IsString } from 'class-validator';
import { Question } from 'src/card/question/question.entity';
export class QuestionInput implements Partial<Question> {
  @IsString()
  title: string;

  @IsString({ each: true })
  options: string[];

  @IsString()
  answer: string;
}
