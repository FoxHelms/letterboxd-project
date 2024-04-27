import { Injectable } from '@nestjs/common';
import { parse } from 'node-html-parser';
import { Film } from './films/film.entity';
import { FilmService } from './films/film.service';
import { LetterboxdFilm, LetterboxdFilmRequest } from './films/film.types';

@Injectable()
export class AppService {
  constructor(private readonly filmService: FilmService) {}

  async getAllFilms(): Promise<Film[]> {
    const filmArray: Film[] = [];
    for (let j = 1; j <= 349; j++) {
      console.log(`Scraping page ${j}/349`);
      const resp = await fetch(
        `https://letterboxd.com/hershwin/list/all-the-movies/page/${j}/`,
      );
      let i: number;
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
    }

    return filmArray;
  }

  async getFilmObject(
    letterboxdRequest: LetterboxdFilmRequest,
  ): Promise<LetterboxdFilm> {
    const resp = await fetch(
      `https://letterboxd.com/film/${letterboxdRequest.title}-${letterboxdRequest.year}`,
    );
    const respBody = await resp.text();
    const parsedPage = parse(respBody);
    const allCastLinks = parsedPage.querySelectorAll('a[href^="/actor/"]');
    const allDirectorLinks = parsedPage.querySelectorAll(
      'a[href^="/director/"]',
    );
    const allProducerLinks = parsedPage.querySelectorAll(
      'a[href^="/producer/"]',
    );
    const filmCountry = parsedPage.querySelector(
      'a[href^="/films/country/"]',
    ).text;
    const filmLang = parsedPage.querySelector(
      'a[href^="/films/language/"]',
    ).text;
    const filmGenre = parsedPage.querySelector('a[href^="/films/genre/"]').text;
    const cast = allCastLinks.map((node) => node.text);
    const director = allDirectorLinks.map((node) => node.text);
    const producer = allProducerLinks.map((node) => node.text);
    return {
      title: letterboxdRequest.title,
      year: letterboxdRequest.year,
      directors: director,
      producers: producer,
      language: filmLang,
      country: filmCountry,
      genre: filmGenre,
      actors: cast,
    };
  }
}
