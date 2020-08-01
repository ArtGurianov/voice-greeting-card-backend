import {Args, Mutation} from '@nestjs/graphql'
import {CustomResult} from '../../utils/CustomResult'
import {Public} from '../../utils/public.decorator'
import {AudioService} from './audio.service'
import {AudioFileInfoInput} from './input/audioFileInfo.input'
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
  @Mutation(() => Boolean)
  async activateCardAudio(@Args('cardId') cardId: string): Promise<boolean> {
    return await this.audioService.activateCardAudio(cardId)
  }
}
