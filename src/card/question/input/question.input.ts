import {Field, InputType} from '@nestjs/graphql'
import {IsString} from 'class-validator'
import {Question} from '../question.entity'

@InputType({description: 'Set card data'})
export class QuestionInput implements Partial<Question> {
  @Field()
  @IsString()
  title: string

  @Field()
  @IsString({each: true})
  options: string[]

  @Field()
  @IsString()
  answer: string
}
