import {Args, Mutation, Resolver} from '@nestjs/graphql'
import {CustomResult} from '../../utils/CustomResult'
import {Public} from '../../utils/public.decorator'
import {AudioService} from './audio.service'
import {AudioFileInfoInput} from './input/audioFileInfo.input'
@Resolver()
export class AudioResolver {
  constructor(private readonly audioService: AudioService) {}

  @Public()
  @Mutation(() => CustomResult)
  async signS3(
    @Args('audioFileInfo')
    {cardId, fileName, fileSize}: AudioFileInfoInput,
  ): Promise<CustomResult> {
    return await this.audioService.signS3(cardId, fileName, fileSize)
  }

  @Public()
  @Mutation(() => CustomResult)
  async activateCardAudio(
    @Args('cardId') cardId: string,
  ): Promise<CustomResult> {
    return await this.audioService.activateCardAudio(cardId)
  }
}
