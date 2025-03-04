import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { FilmModule } from 'src/films/film.module';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FilmModule, ReviewModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
