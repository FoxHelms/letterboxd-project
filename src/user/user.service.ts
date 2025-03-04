import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { FilmService } from 'src/films/film.service';
import { Repository } from 'typeorm';
import { parse, HTMLElement } from 'node-html-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewService } from 'src/review/review.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly filmService: FilmService,
    private readonly reviewService: ReviewService,
  ) {}
  getUser(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async getOrCreateUser(username: string): Promise<User> {
    const existingUser = await this.getUser(username);
    if (existingUser) {
      return existingUser;
    } else {
      const user = new User();
      user.username = username;
      return await this.userRepository.save(user);
    }
  }

  async scrapeUser(username: string): Promise<User> {
    const user = await this.getOrCreateUser(username);

    await this.scrapeUserFilms(user);
    await this.scrapeUserReviews(user);

    return user;
  }

  // Note that this overwrites a user's films in the DB
  async scrapeUserFilms(user: User) {
    const filmsUrl = `https://letterboxd.com/${user.username}/films`;
    const filmsResp = await fetch(filmsUrl);
    const maxPage = this.getMaxPage(parse(await filmsResp.text()));

    const userWithFilms = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['films'],
    });

    if (userWithFilms) {
      const films = [];
      const missingFilms = [];
      for (let j = 1; j <= maxPage; j++) {
        console.log(`Scraping page ${j}/${maxPage}`);
        const resp = await fetch(`${filmsUrl}/page/${j}/`);
        const parsedBody = parse(await resp.text());
        const filmIdList = parsedBody
          .querySelectorAll('[data-film-id]')
          .map((el) => el.getAttribute('data-film-id'));

        // Find existing films by letterboxdId
        for (const letterboxdId of filmIdList) {
          const film =
            await this.filmService.getFilmByLetterboxdId(letterboxdId);
          if (film) {
            films.push(film);
          } else {
            missingFilms.push(letterboxdId);
          }
        }
      }

      // TODO: scrape missing films here and update DB
      console.log('The following films are missing from DB: ', missingFilms);

      // Update user's films
      userWithFilms.films = Promise.resolve(films);
      await this.userRepository.save(userWithFilms);
    }
  }

  async scrapeUserReviews(user: User) {
    const reviewsUrl = `https://letterboxd.com/${user.username}/reviews`;
    const reviewsResp = await fetch(reviewsUrl);
    const maxPage = this.getMaxPage(parse(await reviewsResp.text()));

    // Collect all reviews first
    const reviewsToSave = [];
    for (let j = 1; j <= maxPage; j++) {
      console.log(`Scraping page ${j}/${maxPage}`);
      const resp = await fetch(`${reviewsUrl}/page/${j}/`);
      const parsedBody = parse(await resp.text());
      const reviewUrls = parsedBody
        .querySelectorAll(
          '.film-detail-content .headline-2.prettify a:first-child',
        )
        .map((el) => el.getAttribute('href'));

      // url of format '/{username}/film/{filmname}/'
      for (const url of reviewUrls) {
        const review = await this.reviewService.scrapeReview(url);
        review.user = user;

        const filmName = url.split('/')[2];
        const film = await this.filmService.getFilmByName(filmName);
        if (film) {
          review.film = film;
        }

        reviewsToSave.push(review);
      }
    }

    // Save all reviews in a single transaction
    await this.reviewService.saveMany(reviewsToSave);
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
}
