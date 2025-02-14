import { Injectable } from '@nestjs/common';
import { Film } from './film.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
  ) {}

  saveFilm(name: string, letterboxdId: string): Promise<Film> {
    const film = new Film();
    film.name = name;
    film.letterboxdId = letterboxdId;
    return this.filmRepository.save(film);
  }

  getFilmByLetterboxdId(letterboxdId: string): Promise<Film> {
    return this.filmRepository.findOne({ where: { letterboxdId } });
  }

  getAllFilms() {
    return this.filmRepository.find();
  }
}
