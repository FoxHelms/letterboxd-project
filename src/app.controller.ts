import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { Film } from './films/film.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Post('films/scrape')
  async scrapeAllFilms(@Query('save') save?: boolean): Promise<Film[]> {
    return await this.appService.scrapeAllFilms(save);
  }

  @Get('films/all')
  async getAllFilms(): Promise<Film[]> {
    return await this.appService.getAllFilms();
  }

  @Post('user/scrape/:username')
  async scrapeUser(@Param('username') username: string) {
    return await this.userService.scrapeUser(username);
  }
}
