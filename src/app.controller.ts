import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Film } from './films/film.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('films/scrape')
  async scrapeAllFilms(@Query('save') save?: boolean): Promise<Film[]> {
    return await this.appService.scrapeAllFilms(save);
  }

  @Post('films/download')
  async downloadFilms() {
    return await this.appService.downloadFilms();
  }

  @Get('films/all')
  async getAllFilms(): Promise<Film[]> {
    return await this.appService.getAllFilms();
  }
}
