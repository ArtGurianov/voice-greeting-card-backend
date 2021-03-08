import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {User} from 'src/user/user.entity';

@Entity('distributors')
export class Distributor extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE', primary: true })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ name: 'userId' })
  userId: string;
}
