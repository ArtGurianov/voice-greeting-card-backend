import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('customers')
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE', primary: true })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ name: 'userId' })
  userId: string;
}
