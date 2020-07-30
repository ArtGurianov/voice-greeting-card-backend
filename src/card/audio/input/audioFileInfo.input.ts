import {Field, InputType} from '@nestjs/graphql'
import {IsNumber, IsString, IsUUID, Max} from 'class-validator'

@InputType()
export class AudioFileInfoInput {
  @Field()
  @IsUUID()
  cardId: string

  @Field()
  @IsString()
  fileName: string

  @Field()
  @IsNumber()
  @Max(1000000)
  fileSize: number
}
