import { Injectable } from '@nestjs/common';
import { Film, genre } from './film.entity';
import { parse } from 'node-html-parser';
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

  getFilmByName(name: string): Promise<Film> {
    return this.filmRepository.findOne({ where: { name } });
  }

  getAllFilms(): Promise<Film[]> {
    return this.filmRepository.find();
  }

  async scrapeFilmData(filmName: string, letterboxdId: string): Promise<Film> {
    try {
      const film = new Film();
      const filmGenres: genre[] = [];
      const collectedStats = {
        members: 0,
        fans: 0,
        likes: 0,
        reviews: 0,
        lists: 0,
      };
      const resp = await fetch(`https://letterboxd.com/film/${filmName}/`);
      const ratingsResp = await fetch(
        `https://letterboxd.com/film/${filmName}/ratings`,
      );
      const respBody = await resp.text();
      const ratingsRespBody = await ratingsResp.text();
      const parsedPage = parse(respBody);
      const parsedRatings = parse(ratingsRespBody);

      const averageRatingString = parsedPage
        .querySelector('[name="twitter:data2"]')
        .getAttribute('content')
        .split(' ')
        .at(0);

      const averageRating = parseInt(averageRatingString);

      // TODO: this genre section throws frequent errors
      const genreThemeString = parsedPage
        .getElementById('tab-genres')
        .textContent.replace(/[^a-zA-Z ]/g, '');

      let tempGenreStr;
      if (genreThemeString.includes('Themes')) {
        tempGenreStr = genreThemeString.match('Genre(.*) Themes').at(1);
      } else {
        tempGenreStr = genreThemeString.match('Genre(.*)').at(1);
      }

      const filmGenresStringArray = [];

      if (tempGenreStr.includes('Science Fiction')) {
        filmGenresStringArray.push('ScienceFiction');
        tempGenreStr = tempGenreStr.replace('Science Fiction', '');
      }

      if (tempGenreStr.includes('TV Movie')) {
        filmGenresStringArray.push('TVMovie');
        tempGenreStr = tempGenreStr.replace('TV Movie', '');
      }
      tempGenreStr = tempGenreStr.trim()

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

      const tempThemesStr = genreThemeString.match('Themes(.*) Show All');
      const filmThemes = tempThemesStr ? tempThemesStr.at(1) : '';

      Object.keys(collectedStats).forEach((category) => {
        const statElement = parsedRatings.querySelector(
          `[href="/film/${filmName}/${category}/"]`,
        );
        const statCount = statElement
          .getAttribute('title')
          .replace(/[^0-9]/g, '');

        collectedStats[category] = parseInt(statCount);
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
      const runtime = parseInt(runtimeString.replace(/[^0-9]/g, ''));

      const tagline = reviewElement.querySelector('[class="tagline"]')
        ? reviewElement.querySelector('[class="tagline"]').textContent
        : 'No tagline found.';

      const fullSummary = reviewElement
        .getElementsByTagName('p')
        .at(0).textContent;

      film.name = filmName;
      film.letterboxdId = letterboxdId;
      film.releaseYear = filmYear;
      film.averageRating = averageRating;
      film.genre = filmGenres;
      film.themes = filmThemes;
      film.watchedCount = collectedStats['members'];
      film.fansCount = collectedStats['fans'];
      film.likesCount = collectedStats['likes'];
      film.reviewsCount = collectedStats['reviews'];
      film.listsCount = collectedStats['lists'];
      film.runtime = runtime;
      film.tagline = tagline;
      film.fullSummary = fullSummary;

      console.log('Saving new film: ', film.name);
      return await this.filmRepository.save(film);
    } catch (error) {
      console.error(`Error scraping film data for ${filmName}:`, error);
    }
  }
}
