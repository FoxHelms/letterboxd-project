import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { FilmModule } from 'src/films/film.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FilmModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
