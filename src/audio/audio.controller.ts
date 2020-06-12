import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import {FileInterceptor} from '@nestjs/platform-express'
import {Response} from 'express'
import {AudioService} from './audio.service'

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get()
  getAudio(): string {
    return this.audioService.getAudio()
  }

  @Post('uploadAudio')
  @UseInterceptors(FileInterceptor('audiofile'))
  async uploadAudio(@UploadedFile() audiofile: any, @Res() res: Response) {
    const message = await this.audioService.processAudio(audiofile)
    res.status(HttpStatus.OK).send({status: 'ok', message})
  }
}
