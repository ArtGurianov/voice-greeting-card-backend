import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {InjectRepository} from '@nestjs/typeorm'
import {S3} from 'aws-sdk'
import fetch from 'isomorphic-unfetch'
import {RedisServiceAdapter} from '../../redis/redisAdapter.service'
import {REDIS_PREFIXES} from '../../types/redisPrefixes.enum'
import {defaultInsecureKey} from '../../utils/constants'
import {CardRepository} from '../card.repository'

@Injectable()
export class AudioService {
  public constructor(
    private readonly redisService: RedisServiceAdapter,
    private readonly configService: ConfigService,
    @InjectRepository(CardRepository)
    private readonly cardRepo: CardRepository,
  ) {}

  async transcribeAudioFile(audiofile: any): Promise<string> {
    const result = await fetch('https://api.wit.ai/speech', {
      method: 'post',
      headers: {
        accept: 'application/json',
        authorization:
          'Bearer ' +
          this.configService.get<string>('witaiKey', defaultInsecureKey),
        'Content-Type': 'audio/wav',
      },
      body: audiofile.buffer,
    })
    const data = await result.json()
    return data.text ? data.text : 'Введите текст.'
  }

  async signS3(
    cardId: string,
    fileName: string,
    fileSize: number,
  ): Promise<string> {
    if (fileSize > 1000000) throw new PayloadTooLargeException()
    if (fileName.split('.').slice(-1)[0] !== 'wav')
      throw new NotAcceptableException()

    const alreadySigned = await this.redisService.get(
      `${REDIS_PREFIXES.UPLOAD_S3}${cardId}`,
    )
    if (alreadySigned) return alreadySigned

    const card = await this.cardRepo.findOne({id: cardId})
    if (!card) throw new NotFoundException('card not found')
    if (card.isActivatedAudio) throw new ConflictException() //want to return CustomResult but can't make union with string. Don't want to cast string into ObjectType
    // return new CustomResult({
    //   errors: [
    //     new CustomError({
    //       location: 'Card',
    //       errorMessages: ['this card is already activated'],
    //     }),
    //   ],
    // })
    const s3 = new S3({
      signatureVersion: 'v4',
      region: 'eu-central-1',
      accessKeyId: this.configService.get<string>(
        'awsAccessKeyId',
        defaultInsecureKey,
      ),
      secretAccessKey: this.configService.get<string>(
        'awsSecretAccessKey',
        defaultInsecureKey,
      ),
    })

    const url = await s3.getSignedUrl('putObject', {
      ACL: 'public-read',
      Bucket: this.configService.get<string>(
        's3BucketName',
        defaultInsecureKey,
      ),
      Key: cardId,
      Expires: 60,
      ContentType: 'audio/wave',
    })

    if (!url) throw new InternalServerErrorException()

    await this.redisService.set(
      `${REDIS_PREFIXES.UPLOAD_S3}${cardId}`,
      url,
      60 * 10,
    )

    return url
  }

  // async uploadAudioFile(cardId: string, audiofile: any): Promise<CustomResult> {
  //   const card = await this.cardRepo.findOne({id: cardId})
  //   if (!card) throw new NotFoundException('card not found')
  //   if (card.isActivated)
  //     return new CustomResult({
  //       errors: [
  //         new CustomError({
  //           location: 'Card',
  //           errorMessages: ['this card is already activated'],
  //         }),
  //       ],
  //     })

  //   const newId = v4()
  //   try {
  //     fs.writeFileSync(`${newId}.wav`, audiofile.buffer)
  //   } catch (_) {
  //     throw new InternalServerErrorException('could not upload file')
  //   }

  //   const savedAudioFileData = this.audioRepo.save({
  //     url: `${this.configService.get<string>(
  //       's3BucketKey',
  //       defaultInsecureKey,
  //     )}/${newId}`,
  //   })

  //   if (!savedAudioFileData) throw new InternalServerErrorException()

  //   return new CustomResult({ok: true})
  // }

  async activateCardAudio(cardId: string): Promise<boolean> {
    const card = await this.cardRepo.findOne({id: cardId})
    if (!card) throw new NotFoundException('card not found')
    if (card.isActivatedAudio) throw new ConflictException() //want to return CustomResult but can't make union with string. Don't want to cast string into ObjectType

    const isPending = await this.redisService.get(
      `${REDIS_PREFIXES.UPLOAD_S3}${cardId}`,
    )
    if (!isPending) throw new NotFoundException()
    await this.redisService.del(`${REDIS_PREFIXES.UPLOAD_S3}${cardId}`)

    const saved = await this.cardRepo.save({...card, isActivatedAudio: true})
    if (!saved) throw new InternalServerErrorException()
    return true
  }
}

//TODO: audio repo no need at all. audiofile name is the same as cardId. All we need is to toggle AudioSet in CardEntity
