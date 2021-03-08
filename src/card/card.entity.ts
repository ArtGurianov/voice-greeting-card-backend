import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question/question.entity';

@Entity('cards')
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'boolean', default: false })
  isPrinted!: boolean;

  @Column({ type: 'boolean', default: false })
  isActivatedAudio!: boolean;

  @Column({ type: 'boolean', default: false })
  isActivatedQuestions!: boolean;

  @Column({ type: 'boolean', default: false })
  isRevoked!: boolean;

  @Column({ type: 'uuid', nullable: true })
  distributorId: string;

  @Column({ type: 'uuid' })
  issuedBy!: string;

  @OneToMany(
    () => Question,
    q => q.card,
  )
  questions: Promise<Question[]>;
}
