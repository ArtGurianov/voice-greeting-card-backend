import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import fetch from 'isomorphic-unfetch';
import { RedisServiceAdapter } from '../../redis/redisAdapter.service';
import { REDIS_PREFIXES } from '../../types/redisPrefixes.enum';
import { MiB } from '../../utils/units';
import { defaultInsecureKey } from '../../utils/constants';
import { CustomError, CustomResult } from '../../utils/CustomResult';
import { CardRepository } from '../card.repository';

@Injectable()
export class AudioService {
  public constructor(
    private readonly redisService: RedisServiceAdapter,
    private readonly configService: ConfigService,
    @InjectRepository(CardRepository)
    private readonly cardRepo: CardRepository,
  ) {
    this.audioStorage = new S3({
      signatureVersion: 'v4',
      region: 'eu-central-1', //region should come from env
      accessKeyId: configService.get<string>(
        'awsAccessKeyId',
        defaultInsecureKey,
      ),
      secretAccessKey: configService.get<string>(
        'awsSecretAccessKey',
        defaultInsecureKey,
      ),
    });
  }

  private readonly audioStorage: S3

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
    });
    const data = await result.json();
    return data && data.text ? data.text : 'Введите текст.';
  }

  async signS3(
    cardId: string,
    fileName: string,
    fileSizeBytes: number,
  ): Promise<CustomResult> {
    if (fileSizeBytes > 100 * MiB) {
      throw new PayloadTooLargeException('file is too big');
    }

    if (!fileName.endsWith('.wav')) {
      throw new NotAcceptableException('unsupported file format');
    }

    const alreadySigned = await this.redisService.get(
      `${REDIS_PREFIXES.UPLOAD_S3}${cardId}`,
    );
    if (alreadySigned) return new CustomResult({ok: true, value: alreadySigned});

    const card = await this.cardRepo.findOne({id: cardId});
    if (!card) {
      throw new NotFoundException('card not found');
    }


    const url = await this.audioStorage.getSignedUrl('putObject', {
      ACL: 'public-read',
      Bucket: this.configService.get<string>(
        's3BucketName',
        defaultInsecureKey,
      ),
      Key: cardId,
      Expires: 60, // seconds
      ContentType: 'audio/wave',
    });

    if (!url) {
      // TODO: log this
      throw new InternalServerErrorException();
    }

    await this.redisService.set(
      `${REDIS_PREFIXES.UPLOAD_S3}${cardId}`,
      url,
      60 * 10,
    );

    return new CustomResult({ok: true, value: url});
  }

  async activateCardAudio(cardId: string): Promise<CustomResult> {
    const card = await this.cardRepo.findOne({id: cardId});
    if (!card) throw new NotFoundException('card not found');
    if (card.isActivatedAudio)
      return new CustomResult({
        errors: [
          new CustomError({
            location: 'Card',
            errorMessages: ['audio file for this card already exists'],
          }),
        ],
      });

    const isPending = await this.redisService.get(
      `${REDIS_PREFIXES.UPLOAD_S3}${cardId}`,
    );
    if (!isPending) throw new NotFoundException();
    await this.redisService.del(`${REDIS_PREFIXES.UPLOAD_S3}${cardId}`);

    const activated = await this.cardRepo.save({
      ...card,
      isActivatedAudio: true,
    });

    if (!activated) {
      throw new InternalServerErrorException("failed to save card's audio");
    }

    return new CustomResult({ok: true});
  }
}
