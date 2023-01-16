export enum MediaType {
  ALL = 'all',
  MOVIE = 'movie',
  SERIES = 'series',
}

export type MediaEntity = {
  id: string;
  title: string;
  dateWatched: string;
  dateWatchedSeasons: string[];
  tags: Tags[];
  mediaType: MediaType;
  thumbnail: string;
  imdbID: string;
  year: string;
  rating: number;
  ratings: string;
  watched: boolean;
};

export type SearchResult = {
  Poster: string;
  Title: string;
  Type: MediaType;
  Year: string;
  imdbID: string;
  tags?: Tags[];
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
  TO_WATCH = 'to_watch',
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

export enum Colors {
  LIGHT = '#ffffff',
  DARK = '#000000',
  WARNING = 'orange',
  DANGER = '#fe2b2b',
  ACTION = '#316dd1',
  DISABLED = '#c3c3c3',
  WATCHED = '#7500dd',
  TO_WATCH = '#00873c',
}

export enum RatingSource {
  ROTTEN_TOMATOES = 'Rotten Tomatoes',
  IMDB = 'Internet Movie Database',
  METACRITIC = 'Metacritic',
  USER_RATING = 'userRating',
}

export enum RatingSourceSortParam {
  ROTTEN_TOMATOES = 'rtRating',
  IMDB = 'imdbRating',
}

export enum SearchParam {
  MEDIA_TYPE = 'mediaType',
  SEARCH = 'search',
  SORT = 'sort',
  FILTER = 'filter',
}

export enum Notifications {
  ADDED = 'ADDED',
  REMOVED = 'REMOVED',
  NONE = 'NONE',
}

export enum Tags {
  ALL = 'all',
  CHRISTMAS = 'christmas',
  HALLOWEEN = 'halloween',
}
