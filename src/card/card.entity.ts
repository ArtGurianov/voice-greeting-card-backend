import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity('cards')
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({type: 'boolean', default: false})
  isPrinted!: boolean

  @Column({type: 'boolean', default: false})
  isActivated!: boolean

  @Column({type: 'boolean', default: false})
  isRevoked!: boolean

  @Column({type: 'uuid'})
  distributorId: string

  @Column({type: 'uuid'})
  issuedBy!: string

  //one to one
  @Column({type: 'uuid', nullable: true})
  audioFileId: string

  //one to one
  @Column({type: 'uuid', nullable: true})
  quizId: string
}
