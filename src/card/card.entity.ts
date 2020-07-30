import {Field, ID, ObjectType} from '@nestjs/graphql'
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import {Question} from './question/question.entity'

ObjectType()
@Entity('cards')
export class Card extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field()
  @Column({type: 'boolean', default: false})
  isPrinted!: boolean

  @Field()
  @Column({type: 'boolean', default: false})
  isActivatedAudio!: boolean

  @Field()
  @Column({type: 'boolean', default: false})
  isActivatedQuestions!: boolean

  @Field()
  @Column({type: 'boolean', default: false})
  isRevoked!: boolean

  @Field(() => ID)
  @Column({type: 'uuid'})
  distributorId: string

  @Field(() => ID)
  @Column({type: 'uuid'})
  issuedBy!: string

  @Field(() => [Question])
  @OneToMany(
    () => Question,
    q => q.cardId,
  )
  questions: Promise<Question[]>
}
