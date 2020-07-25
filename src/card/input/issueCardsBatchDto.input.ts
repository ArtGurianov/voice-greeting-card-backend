import {IsNumber, Max, Min} from 'class-validator'

//export class IssueCardsBatchDto implements Partial<Card> {
export class IssueCardsBatchDto {
  @IsNumber()
  @Min(1)
  @Max(10)
  quantity: number
}
