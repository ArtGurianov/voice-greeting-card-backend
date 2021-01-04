import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthTypes } from '../types/authTypes';
import { UserRoles } from '../types/roles';
import { Public } from '../utils/public.decorator';
import { Roles } from '../utils/roles.decorator';
import { Card } from './card.entity';
import { CardService } from './card.service';

@ApiTags('card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Public()
  @Get('/:cardId')
  async getCardData(@Param('cardId') cardId: string): Promise<Card> {
    return await this.cardService.getCardData(cardId);
  }

  @Roles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.DISTRIBUTOR)
  @Post('/issueCardsBatch')
  async issueCardsBatch(
    @Req() { jwtPayload }: Request,
    @Body('quantity') quantity: number,
  ): Promise<string[]> {
    if (jwtPayload!.authType === AuthTypes.FakeAuth) {
      return [];
    }
    console.log(jwtPayload);
    return await this.cardService.issueCardsBatch(quantity, jwtPayload!.userId);
  }
}
