import { Field, ID, ObjectType } from '@nestjs/graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { APPLICATION_STATUS } from '../types/applicationStatus.enum'
import { UserRoles } from '../types/roles'
@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field()
  @Column({type: 'text', unique: true, nullable: false})
  email!: string

  @Column({type: 'text', nullable: false})
  password!: string

  @Field()
  @Column({type: 'int', default: 0})
  tokenVersion: number

  @Field()
  @Column({type: 'text', default: UserRoles.CUSTOMER})
  role: UserRoles

  @Field()
  @Column({type: 'text', default: APPLICATION_STATUS.PENDING})
  status: APPLICATION_STATUS
}
