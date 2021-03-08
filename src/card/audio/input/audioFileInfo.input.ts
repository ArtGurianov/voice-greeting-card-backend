import { IsNumber, IsString, IsUUID, Max } from 'class-validator';
import { MiB } from 'src/utils/units';

export class AudioFileInfoInput {
  @IsUUID()
  cardId: string;

  @IsString()
  fileName: string;

  @IsNumber()
  @Max(100 * MiB)
  fileSizeBytes: number;
}
