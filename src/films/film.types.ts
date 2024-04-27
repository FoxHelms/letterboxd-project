export type LetterboxdFilmRequest = {
  title: string;
  year: string;
};

export type LetterboxdFilm = {
  title: string;
  year: string;
  directors: string[];
  producers: string[];
  genre: string;
  country: string;
  language: string;
  actors: string[];
};
