import {Args, Mutation} from '@nestjs/graphql'
import {Public} from '../../utils/public.decorator'
import {AudioService} from './audio.service'
import {AudioFileInfoInput} from './input/audioFileInfo.input'
export class AudioResolver {
  constructor(private readonly audioService: AudioService) {}

  @Public()
  @Mutation(() => String)
  async signS3(
    @Args('audioFileInfo')
    {cardId, fileName, fileSize}: AudioFileInfoInput,
  ): Promise<string> {
    return await this.audioService.signS3(cardId, fileName, fileSize)
  }

  @Public()
  @Mutation(() => Boolean)
  async activateCard(@Args('cardId') cardId: string): Promise<boolean> {
    return await this.audioService.activateCardAudio(cardId)
  }
}
