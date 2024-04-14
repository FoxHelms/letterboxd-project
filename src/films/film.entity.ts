import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  letterboxdId: string;
}
