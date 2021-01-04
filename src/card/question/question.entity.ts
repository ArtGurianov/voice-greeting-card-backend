import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from 'src/card/card.entity';

@Entity('questions')
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  title: string;

  @Column('text', { array: true })
  options: string[];

  @Column('text')
  answer: string;

  @ManyToOne(
    () => Card,
    c => c.questions,
    { onDelete: 'CASCADE' },
  )
  card: Promise<Card>;
  @JoinColumn({ name: 'cardId' })
  @Column('uuid')
  cardId: string;
}
