import { Injectable } from '@nestjs/common';
import { parse, HTMLElement } from 'node-html-parser';
import { Film, genre } from './films/film.entity';
import { FilmService } from './films/film.service';

@Injectable()
export class AppService {
  constructor(private readonly filmService: FilmService) {}

  async scrapeAllFilms(save: boolean = false): Promise<Film[]> {
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

  async scrapeFilmData(filmName: string, letterboxdId: string) {
    const film = new Film();
    const filmGenres: genre[] = [];
    const collectedStats = {
      members: '',
      fans: '',
      likes: '',
      reviews: '',
      lists: '',
    };
    const resp = await fetch(`https://letterboxd.com/film/${filmName}/`);
    const ratingsResp = await fetch(
      `https://letterboxd.com/film/${filmName}/ratings`,
    );
    const respBody = await resp.text();
    const ratingsRespBody = await ratingsResp.text();
    const parsedPage = parse(respBody);
    const parsedRatings = parse(ratingsRespBody);

    const averageRating = parsedPage
      .querySelector('[name="twitter:data2"]')
      .getAttribute('content')
      .split(' ')
      .at(0);

    const genreThemeString = parsedPage
      .getElementById('tab-genres')
      .textContent.replace(/[^a-zA-Z ]/g, '');

    let tempGenreStr = genreThemeString.match('Genre(.*) Themes').at(1);
    const tempThemesStr = genreThemeString.match('Themes(.*) Show All');

    const filmGenresStringArray = [];

    if (tempGenreStr.includes('Science Fiction')) {
      filmGenresStringArray.push('ScienceFiction');
      tempGenreStr = tempGenreStr.replace('Science Fiction', '');
    }

    if (tempGenreStr.includes('TV Movie')) {
      filmGenresStringArray.push('TVMovie');
      tempGenreStr = tempGenreStr.replace('TV Movie', '');
    }

    tempGenreStr.includes(' ')
      ? filmGenresStringArray.push(...tempGenreStr.substring(1).split(' '))
      : filmGenresStringArray.push(tempGenreStr);

    filmGenresStringArray.forEach((filmGenresString) => {
      if (filmGenresString) {
        Object.values(genre).includes(filmGenresString as genre)
          ? filmGenres.push(genre[filmGenresString])
          : filmGenres.push(genre.Unknown);
      }
    });

    const filmThemes = tempThemesStr.at(1);

    Object.keys(collectedStats).forEach((category) => {
      const statElement = parsedRatings.querySelector(
        `[href="/film/${filmName}/${category}/"]`,
      );
      const statCount = statElement
        .getAttribute('title')
        .replace(/[^0-9]/g, '');

      collectedStats[category] = statCount;
    });

    const filmWrapper = parsedPage.getElementById('film-page-wrapper');
    const reviewElement = filmWrapper.querySelector(
      '[class="review body-text -prose -hero prettify"]',
    );

    const filmYear = filmWrapper.querySelector(
      '[class="releaseyear"]',
    ).textContent;

    const runtimeString = filmWrapper.querySelector(
      '[class="text-link text-footer"]',
    ).textContent;
    const runtime = runtimeString.replace(/[^0-9]/g, '');

    const tagline = reviewElement.querySelector('[class="tagline"]').textContent
      ? reviewElement.querySelector('[class="tagline"]').textContent
      : filmWrapper.querySelector('[class="tagline"]').textContent;

    const fullSummary = reviewElement
      .getElementsByTagName('p')
      .at(0).textContent;

    film.name = filmName;
    film.letterboxdId = letterboxdId;
    film.releaseYear = filmYear;
    film.averageRating = parseInt(averageRating);
    film.genre = filmGenres;
    film.themes = filmThemes;
    film.watchedCount = parseInt(collectedStats['members']);
    film.fansCount = parseInt(collectedStats['fans']);
    film.likesCount = parseInt(collectedStats['likes']);
    film.reviewsCount = parseInt(collectedStats['reviews']);
    film.listsCount = parseInt(collectedStats['lists']);
    film.runtime = parseInt(runtime);
    film.tagline = tagline;
    film.fullSummary = fullSummary;

    console.log('new film obj', film);
    return film;
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
