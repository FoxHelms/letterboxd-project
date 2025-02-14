import { Review } from 'src/review/review.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Film {
  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  letterboxdId: string;

  @OneToMany(() => Review, (review) => review.film)
  reviews: Review[];

  @ManyToMany(() => User, (user) => user.films)
  users: User[];
}
