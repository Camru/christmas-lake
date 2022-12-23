export enum MediaType {
  ALL = 'all',
  MOVIE = 'movie',
  SERIES = 'series',
}

export type MediaEntity = {
  id: string;
  title: string;
  dateWatched: string;
  mediaType: MediaType;
  thumbnail: string;
  imdbID: string;
  year: string;
  rating: string;
  watched: boolean;
};

export type SearchResult = {
  Poster: string;
  Title: string;
  Type: MediaType;
  Year: string;
  imdbID: string;
};

export type SearchResultByIdOrTitle = {
  Title: string;
  Year: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Poster: string;
  Ratings: MediaRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  totalSeasons: string;
};
export type MediaRating = {
  Source: string;
  Value: string; //"8.7/10"
};

type ToWatchMediaEntity = {
  Title: string;
  Year: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Poster: string;
  Ratings: MediaRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  totalSeasons: string;
};

export enum REACT_QUERY_API_KEYS {
  WATCHED = 'watched',
  OMDB_SEARCH = 'omdb_search',
  OMDB_SEARCH_BY_ID = 'omdb_search_by_id',
  OMDB_SEARCH_BY_TITLE = 'omdb_search_by_title',
}

export enum URL_PATHS {
  TO_WATCH = 'to-watch',
  WATCHED = 'watched',
  SEARCH = 'search',
}

export type Tab = {
  label: string;
  value: string;
};

export enum ButtonColor {
  DEFAULT = 'gray',
  SUCCESS = '#00873c',
  WARNING = 'orange',
  DANGER = '#fe2b2b',
}

export enum RatingSource {
  ROTTEN_TOMATOES = 'Rotten Tomatoes',
  IMDB = 'Internet Movie Database',
  METACRITIC = 'Metacritic',
}

export enum SearchParam {
  MEDIA_TYPE = 'mediaType',
  SEARCH = 'search',
}