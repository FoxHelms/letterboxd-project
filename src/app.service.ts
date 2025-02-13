import { Injectable } from '@nestjs/common';
import { parse, HTMLElement } from 'node-html-parser';
import { Film } from './films/film.entity';
import { FilmService } from './films/film.service';

@Injectable()
export class AppService {
  constructor(private readonly filmService: FilmService) {}

  async scrapeAllFilms(save: boolean = false): Promise<Film[]> {
    const resp = await fetch(
      'https://letterboxd.com/hershwin/list/all-the-movies/',
    );
    let i: number;
    const filmArray: Film[] = [];
    const maxPage = this.getMaxPage(parse(await resp.text()));

    for (let j = 1; j <= maxPage; j++) {
      console.log(`Scraping page ${j}/${maxPage}`);
      const resp = await fetch(
        `https://letterboxd.com/hershwin/list/all-the-movies/page/${j}/`,
      );
      let i: number;
      const respBody = await resp.text();
      const parsedPage = parse(respBody);
      const filmsList = parsedPage.querySelectorAll(
        '[class="poster-container numbered-list-item"]',
      );
      // console.log('film list item: ', filmsList.at(1));
      // console.log('film list item inner html: ', filmsList.at(1).innerHTML);

      filmsList.forEach((film) => {
        const newFilm = new Film();
        newFilm.name = film
          .getElementsByTagName('div')
          .at(0)
          .getAttribute('data-film-slug');
        newFilm.letterboxdId = film
          .getElementsByTagName('div')
          .at(0)
          .getAttribute('data-film-id');

        filmArray.push(newFilm);
      });
    }

    if (save) {
      const filmPromises = new Array<Promise<Film>>();
      for (const film of filmArray) {
        filmPromises.push(
          this.filmService.saveFilm(film.name, film.letterboxdId),
        );
      }
      const res = await Promise.all(filmPromises);
      console.log(res);
    }

    return filmArray;
  }

  private getMaxPage(parsedHtml: HTMLElement): number {
    const paginatePages = parsedHtml.querySelectorAll('.paginate-page');
    if (paginatePages.length === 0) {
      return 1;
    }

    const lastPage = paginatePages[paginatePages.length - 1];
    const pageNumber = lastPage.querySelector('a')?.textContent;

    return pageNumber ? parseInt(pageNumber, 10) : 1;
  }

  getAllFilms() {
    return this.filmService.getAllFilms();
  }
}
