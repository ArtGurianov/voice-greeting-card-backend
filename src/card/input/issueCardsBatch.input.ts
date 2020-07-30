import {Field, InputType} from '@nestjs/graphql'
import {IsNumber, Max, Min} from 'class-validator'

@InputType()
export class CardsBatchInput {
  @Field()
  @IsNumber()
  @Min(1)
  @Max(10)
  quantity: number
}
