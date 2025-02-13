import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from 'src/films/film.entity';
import { FilmService } from 'src/films/film.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Film]),
  ],
  controllers: [],
  providers: [FilmService],
  exports: [FilmService],
})
export class FilmModule {}

