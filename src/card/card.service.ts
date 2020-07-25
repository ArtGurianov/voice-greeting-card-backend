import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Card} from './card.entity'
import {CardRepository} from './card.repository'

@Injectable()
export class CardService {
  public constructor(
    @InjectRepository(CardRepository)
    private readonly cardRepo: CardRepository,
  ) {}

  async issueCardsBatch(quantity: number, adminId: string): Promise<string[]> {
    const initialDataArray = Array.from({length: quantity}, () => {
      return {issuedBy: adminId}
    })
    const result = await this.cardRepo.save(initialDataArray)
    console.log(`issued cards batch: ${result}`)
    return []
  }

  async getCardData(id: string): Promise<Card> {
    const card = await this.cardRepo.findOne({id})
    if (!card) throw new NotFoundException()
    return card
  }

  async setCardData(
    id: string,
    {audioFileId, quizId}: {audioFileId: string; quizId: string},
  ): Promise<boolean> {
    const card = await this.cardRepo.findOne({id})
    if (!card) throw new NotFoundException()
    if (card.isActivated)
      throw new BadRequestException(
        'sorry, this greeting card is already used.',
      )

    const savedCard = await this.cardRepo.save({
      ...card,
      audioFileId,
      quizId,
      isActivated: true,
    })

    if (!savedCard) throw new InternalServerErrorException()

    return true
  }
}
