import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import fetch from 'isomorphic-unfetch'

@Injectable()
export class AudioService {
  public constructor(private readonly configService: ConfigService) {}
  //   @InjectRepository(AudioRepository)
  //   private readonly audioRepo: AudioRepository

  //processAudioFile(): {}
  getAudio(): string {
    return 'audio file'
  }

  async processAudio(audiofile: any): Promise<string> {
    //fs.writeFileSync('test.wav', audiofile.buffer) WORKS WELL
    const result = await fetch('https://api.wit.ai/speech', {
      method: 'post',
      headers: {
        accept: 'application/json',
        authorization:
          'Bearer ' +
          this.configService.get<string>('witaiKey', '!default value!'),
        'Content-Type': 'audio/wav',
      },
      body: audiofile.buffer,
    })
    const data = await result.json()
    console.log(data)
    return 'testing'
  }
}
