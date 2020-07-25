import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'
import {UserRoles} from '../types/roles'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({type: 'text', unique: true, nullable: false})
  email!: string

  @Column({type: 'text', nullable: false})
  password!: string

  @Column({type: 'int', default: 0})
  tokenVersion: number

  @Column({type: 'text', default: UserRoles.CUSTOMER})
  role: UserRoles
}
