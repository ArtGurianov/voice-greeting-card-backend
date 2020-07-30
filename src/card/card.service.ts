import {Injectable, NotFoundException} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Card} from './card.entity'
import {CardRepository} from './card.repository'

@Injectable()
export class CardService {
  public constructor(
    @InjectRepository(CardRepository)
    private readonly cardRepo: CardRepository,
  ) {}

  async issueCardsBatch(quantity: number, userId: string): Promise<string[]> {
    const initialDataArray = Array.from({length: quantity}, () => {
      return {issuedBy: userId}
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
}
