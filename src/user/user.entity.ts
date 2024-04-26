import { Review } from 'src/review/review.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

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

  @Column({ nullable: false })
  letterboxdId: string;

  @OneToMany(() => Review, review => review.user)
  reviews: Promise<Review[]>;
}
