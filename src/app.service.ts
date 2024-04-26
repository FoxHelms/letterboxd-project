import { Injectable } from '@nestjs/common';
import { parse } from 'node-html-parser';
import { Film } from './film/film.entity';
import { FilmService } from './film/film.service';

@Injectable()
export class AppService {
  constructor (
    private readonly filmService: FilmService,
  ) {}

  async getAllFilms(): Promise<Film[]> {
    const resp = await fetch(
      'https://letterboxd.com/hershwin/list/all-the-movies/',
    );
    let i: number;
    const filmArray: Film[] = [];
    const respBody = await resp.text();
    const parsedPage = parse(respBody);
    const filmsList = parsedPage.querySelectorAll(
      '[class="poster-container numbered-list-item"]',
    );
    for (i = 0; i < filmsList.length; i++) {
      const rawFilmString = filmsList.at(i).innerHTML;
      const filmName = rawFilmString.match(
        new RegExp('alt="' + '(.*)' + '"> <span class="frame">'),
      );
      const filmId = rawFilmString.match(
        new RegExp('data-film-id="' + '(.*)' + '" data-film-slug'),
      );
      filmArray.push({
        name: filmName.at(1),
        letterboxdId: filmId.at(1),
        id: '',
      });
    }
    return filmArray;
  }
}
