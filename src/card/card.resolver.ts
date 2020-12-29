import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {MyContext} from 'src/types/MyContext';
import {UserRoles} from 'src/types/roles';
import {Public} from 'src/utils/public.decorator';
import {Roles} from 'src/utils/roles.decorator';
import {Card} from './card.entity';
import {CardService} from './card.service';

@Resolver()
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Public()
  @Query(() => Card)
  async getCardData(@Args('cardId') cardId: string): Promise<Card> {
    return await this.cardService.getCardData(cardId);
  }

  @Roles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.DISTRIBUTOR)
  @Mutation(() => [String])
  async issueCardsBatch(
    @Context() {jwtPayload}: MyContext,
    @Args('quantity') quantity: number,
  ): Promise<string[]> {
    return await this.cardService.issueCardsBatch(quantity, jwtPayload!.userId);
  }
}
