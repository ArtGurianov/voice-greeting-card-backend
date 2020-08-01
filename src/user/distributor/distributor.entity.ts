import {Field, ObjectType} from '@nestjs/graphql'
import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import {User} from '../user.entity'

@ObjectType()
@Entity('distributors')
export class Distributor extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field()
  @OneToOne(() => User, {cascade: true, onDelete: 'CASCADE', primary: true})
  @JoinColumn()
  user: User
}
