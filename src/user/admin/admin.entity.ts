import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('admins')
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE', primary: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId' })
  userId: string;
}
