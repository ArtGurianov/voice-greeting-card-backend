import {Body, Controller, Get, Param, Post, Req} from '@nestjs/common'
import {Request} from 'express'
import {UserRoles} from '../types/roles'
import {Public} from '../utils/public.decorator'
import {Roles} from '../utils/roles.decorator'
import {Card} from './card.entity'
import {CardService} from './card.service'
import {IssueCardsBatchDto} from './input/issueCardsBatchDto.input'

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Public()
  @Get(':id')
  getCardData(@Param() {id}: {id: string}): Promise<Card> {
    return this.cardService.getCardData(id)
  }

  @Public()
  @Post(':id')
  setCardData(
    @Param() {id}: {id: string},
    @Body() cardDto: {audioFileId: string; quizId: string},
  ): Promise<boolean> {
    return this.cardService.setCardData(id, cardDto)
  }

  //ADMIN
  @Roles(UserRoles.ADMIN, UserRoles.DISTRIBUTOR)
  @Post('issue')
  async issueCardsBatch(
    @Body() {quantity}: IssueCardsBatchDto,
    @Req() req: Request,
  ): Promise<string[]> {
    const ids = this.cardService.issueCardsBatch(
      quantity,
      req.jwtPayload!.userId,
    )
    return ids
  }
}
