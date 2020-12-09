import {Field, InputType} from '@nestjs/graphql';
import {IsNumber, IsString, IsUUID, Max} from 'class-validator';

import { MiB } from '../../../utils/units';

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
  @Max(100 * MiB)
  fileSizeBytes: number
}
