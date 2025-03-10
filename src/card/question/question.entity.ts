import {Field, ID, ObjectType} from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Card} from 'src/card/card.entity';

@ObjectType()
@Entity('questions')
export class Question extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field()
  @Column('text')
  title: string

  @Field(() => [String])
  @Column('text', {array: true})
  options: string[]

  @Field()
  @Column('text')
  answer: string

  @ManyToOne(
    () => Card,
    c => c.questions,
    {onDelete: 'CASCADE'},
  )
  card: Promise<Card>
  @JoinColumn({name: 'cardId'})
  @Field(() => ID)
  @Column('uuid')
  cardId: string
}
