import {
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiTags} from '@nestjs/swagger';
import {Response} from 'express';

import {Public} from '../../utils/public.decorator';
import {AudioService} from './audio.service';


@ApiTags('audio')
@Controller()
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Public()
  @Post('transcribeAudio')
  @UseInterceptors(FileInterceptor('audiofile'))
  async uploadAudio(@UploadedFile() audiofile: any, @Res() res: Response) {
    const message = await this.audioService.transcribeAudioFile(audiofile);
    res.status(HttpStatus.OK).send({status: 'ok', message});
  }
}
