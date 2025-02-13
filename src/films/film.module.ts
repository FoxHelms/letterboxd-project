import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './film.entity';
import { FilmService } from './film.service';

@Module({
  imports: [TypeOrmModule.forFeature([Film])],
  controllers: [],
  providers: [FilmService],
  exports: [FilmService],
})
export class FilmModule {}
