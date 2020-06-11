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
  uploadAudio(@UploadedFile() audiofile: any, @Res() res: Response) {
    console.log(audiofile)
    res.status(HttpStatus.OK).send({message: 'successfully uploaded'})
  }
}
