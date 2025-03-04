import { Injectable } from '@nestjs/common';
import { parse, HTMLElement } from 'node-html-parser';
import { Film } from './films/film.entity';
import { FilmService } from './films/film.service';

@Injectable()
export class AppService {
  constructor(private readonly filmService: FilmService) {}

  async scrapeAllFilms(): Promise<Film[]> {
    const resp = await fetch(
      'https://letterboxd.com/hershwin/list/all-the-movies/',
    );
    const filmArray: Film[] = [];
    const maxPage = this.getMaxPage(parse(await resp.text()));

    for (let j = 1; j <= maxPage; j++) {
      console.log(`Scraping page ${j}/${maxPage}`);
      const resp = await fetch(
        `https://letterboxd.com/hershwin/list/all-the-movies/page/${j}/`,
      );
      const respBody = await resp.text();
      const parsedPage = parse(respBody);
      const filmsList = parsedPage.querySelectorAll(
        '[class="poster-container numbered-list-item"]',
      );
      const promiseArray = [];
      // console.log('film list item: ', filmsList.at(1));
      // console.log('film list item inner html: ', filmsList.at(1).innerHTML);

      filmsList.forEach((film) => {
        const name = film
          .getElementsByTagName('div')
          .at(0)
          .getAttribute('data-film-slug');
        const letterboxdId = film
          .getElementsByTagName('div')
          .at(0)
          .getAttribute('data-film-id');

        const promise = this.filmService.scrapeFilmData(name, letterboxdId);
        promiseArray.push(promise);
      });

      filmArray.push(...(await Promise.all(promiseArray)));
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
