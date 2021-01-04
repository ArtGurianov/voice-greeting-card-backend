import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { CustomResult } from 'src/utils/CustomResult';
import { Public } from 'src/utils/public.decorator';
import { AudioService } from './audio.service';
import { AudioFileInfoInput } from './input/audioFileInfo.input';

@ApiTags('audio')
@Controller('/audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Public()
  @Post('/transcribeAudio')
  @UseInterceptors(FileInterceptor('audiofile'))
  async uploadAudio(
    @UploadedFile() audiofile: any,
    @Res() res: Response,
  ): Promise<void> {
    const message = await this.audioService.transcribeAudioFile(audiofile);
    res.status(HttpStatus.OK).send({ status: 'ok', message });
    return;
  }

  @Public()
  @Post('/signS3')
  async signS3(
    @Body('audioFileInfo')
    { cardId, fileName, fileSizeBytes }: AudioFileInfoInput,
  ): Promise<CustomResult> {
    return await this.audioService.signS3(cardId, fileName, fileSizeBytes);
  }

  @Public()
  @Post('/activateCardAudio')
  async activateCardAudio(
    @Body('cardId') cardId: string,
  ): Promise<CustomResult> {
    return await this.audioService.activateCardAudio(cardId);
  }
}
