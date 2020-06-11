import {Injectable} from '@nestjs/common'

@Injectable()
export class AudioService {
  //public constructor(private readonly configService: ConfigService) {}
  //   @InjectRepository(AudioRepository)
  //   private readonly audioRepo: AudioRepository

  //processAudioFile(): {}
  getAudio(): string {
    return 'audio file'
  }
}
