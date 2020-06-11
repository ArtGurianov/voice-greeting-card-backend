import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity('audiofiles')
export class AudioFile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({type: 'boolean', default: false})
  paid!: boolean
}
