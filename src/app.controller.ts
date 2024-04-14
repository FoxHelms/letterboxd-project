import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Film } from './films/film.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('films')
  async getAllFilms(): Promise<Film[]> {
    return await this.appService.getAllFilms();
  }
}
