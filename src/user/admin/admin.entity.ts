import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('admins')
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @PrimaryColumn({type: 'uuid', unique: true, nullable: false})
  userId!: string
}
