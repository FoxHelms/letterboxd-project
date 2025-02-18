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

  @Column({ nullable: false })
  releaseYear: string;

  @Column({ nullable: false })
  averageRating: string;

  @Column({ nullable: false })
  runtime: string;

  @Column({ nullable: false })
  genre: string;

  @Column({ nullable: false })
  themes: string;

  @Column({ nullable: false })
  watchedCount: string;

  @Column({ nullable: false })
  fansCount: string;

  @Column({ nullable: false })
  likesCount: string;

  @Column({ nullable: false })
  reviewsCount: string;

  @Column({ nullable: false })
  listsCount: string;

  @Column({ nullable: false })
  tagline: string;

  @Column({ nullable: false })
  fullSummary: string;

  @OneToMany(() => Review, (review) => review.film)
  reviews: Review[];

  @ManyToMany(() => User, (user) => user.films)
  users: User[];
}
