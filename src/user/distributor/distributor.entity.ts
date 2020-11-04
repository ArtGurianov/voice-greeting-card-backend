import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '../user.entity'

@ObjectType()
@Entity('distributors')
export class Distributor extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field()
  @OneToOne(() => User, {cascade: true, onDelete: 'CASCADE', primary: true})
  @JoinColumn({name: 'userId'})
  user: User

  @Field()
  @Column({name: 'userId'})
  userId: string
}
