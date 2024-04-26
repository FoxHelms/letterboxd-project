import { Film } from 'src/film/film.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Review {
  @UpdateDateColumn()
  updated: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  star_rating: number;

  @Column({ nullable: false, default: false })
  liked: boolean;

  @ManyToOne(() => User, user => user.reviews)
  user: User;

  @ManyToOne(() => Film, film => film.reviews)
  film: Film;
}
