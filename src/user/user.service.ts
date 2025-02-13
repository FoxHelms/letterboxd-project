import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    scrapeUser(username: string, save?: boolean) {
        const baseUrl = `https://letterboxd.com/${username}`
        const filmsUrl = `${baseUrl}`
    }
}