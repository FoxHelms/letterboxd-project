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

export enum genre {
  Action = 'Action',
  Adventure = 'Adventure',
  Animation = 'Animation',
  Comedy = 'Comedy',
  Crime = 'Crime',
  Documentary = 'Documentary',
  Drama = 'Drama',
  Family = 'Family',
  Fantasy = 'Fantasy',
  History = 'History',
  Horror = 'Horror',
  Music = 'Music',
  Mystery = 'Mystery',
  Romance = 'Romance',
  ScienceFiction = 'ScienceFiction',
  Thriller = 'Thriller',
  TVMovie = 'TVMovie',
  War = 'War',
  Western = 'Western',
  Unknown = 'Unknown',
}

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

  @Column({ nullable: false, type: 'float', default: 0 })
  averageRating: number;

  @Column({ nullable: false })
  runtime: number;

  @Column({
    nullable: false,
    array: true,
    default: [],
    type: 'enum',
    enum: genre,
  })
  genre: genre[];

  @Column({ nullable: false })
  themes: string;

  @Column({ nullable: false })
  watchedCount: number;

  @Column({ nullable: false })
  fansCount: number;

  @Column({ nullable: false })
  likesCount: number;

  @Column({ nullable: false })
  reviewsCount: number;

  @Column({ nullable: false })
  listsCount: number;

  @Column({ nullable: false })
  tagline: string;

  @Column({ nullable: false })
  fullSummary: string;

  @OneToMany(() => Review, (review) => review.film)
  reviews: Review[];

  @ManyToMany(() => User, (user) => user.films)
  users: User[];
}
