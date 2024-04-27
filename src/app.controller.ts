import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Film } from './films/film.entity';
import { LetterboxdFilmRequest, LetterboxdFilm } from './films/film.types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('films')
  async getAllFilms(): Promise<Film[]> {
    return await this.appService.getAllFilms();
  }

  @Get('film-obj')
  async getFilmObject(): Promise<LetterboxdFilm> {
    const testRequest: LetterboxdFilmRequest = {
      title: 'parasite',
      year: '2019',
    };
    return await this.appService.getFilmObject(testRequest);
  }
}
