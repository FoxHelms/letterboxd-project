import { Review } from 'src/review/review.entity';
import { Film } from 'src/films/film.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  username: string;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Promise<Review[]>;

  @ManyToMany(() => Film, (film) => film.users)
  @JoinTable({
    name: 'user_films', // name of the junction table
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'film_id',
      referencedColumnName: 'id',
    },
  })
  films: Promise<Film[]>;
}
