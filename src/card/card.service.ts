import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Card} from './card.entity';
import {CardRepository} from './card.repository';

@Injectable()
export class CardService {
  public constructor(
    @InjectRepository(CardRepository)
    private readonly cardRepo: CardRepository,
  ) {}

  async issueCardsBatch(quantity: number, userId: string): Promise<string[]> {
    const initialDataArray = Array.from({length: quantity}, () => {
      return {issuedBy: userId};
    });
    const result = await this.cardRepo.save(initialDataArray);
    return result.map(each => each.id);
  }

  async getCardData(cardId: string): Promise<Card> {
    const card = await this.cardRepo.findOne({
      where: {id: cardId},
      relations: ['questions'],
    });
    if (!card) throw new NotFoundException('no card with the specified id');
    return card;
  }
}
