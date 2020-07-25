import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('manufacturers')
export class Manufacturer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @PrimaryColumn({type: 'uuid', unique: true, nullable: false})
  userId!: string
}
