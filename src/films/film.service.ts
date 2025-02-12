import { Injectable } from '@nestjs/common';
import { Film } from './film.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { writeFile } from 'fs/promises';

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

  async downloadFilms() {
    let fileString = '';
    const filmArray = await this.getAllFilms();
    const csvHeaders = 'Name,LettereboxdId\n';
    filmArray.forEach((film) => {
      fileString += `${film.name}, ${film.letterboxdId}\n`;
      return fileString;
    });

    writeFile('films.csv', csvHeaders + fileString, 'utf8')
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }

  getAllFilms() {
    return this.filmRepository.find();
  }
}
