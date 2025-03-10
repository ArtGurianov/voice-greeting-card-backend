import {Field, ID, ObjectType} from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {User} from 'src/user/user.entity';

@ObjectType()
@Entity('manufacturers')
export class Manufacturer extends BaseEntity {
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
