import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('customers')
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @PrimaryColumn({type: 'uuid', unique: true, nullable: false})
  userId!: string
}
