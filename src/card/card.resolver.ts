import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql'
import {MyContext} from '../types/myContext'
import {UserRoles} from '../types/roles'
import {Public} from '../utils/public.decorator'
import {Roles} from '../utils/roles.decorator'
import {Card} from './card.entity'
import {CardService} from './card.service'

@Resolver()
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Public()
  @Query(() => Card)
  async getCardData(@Args('id') id: string): Promise<Card> {
    return await this.cardService.getCardData(id)
  }

  @Roles(UserRoles.ADMIN, UserRoles.DISTRIBUTOR)
  @Mutation(() => [String])
  async issueCardsBatch(
    @Context() {jwtPayload}: MyContext,
    @Args('quantity') quantity: number,
  ): Promise<string[]> {
    return await this.cardService.issueCardsBatch(quantity, jwtPayload!.userId)
  }
}
