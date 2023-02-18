import axios from 'axios';
import {FindSeriesById} from '../types/types';
const API_KEY = import.meta.env.VITE_MOVIE_DB_API_KEY;

const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
});

const moviedbApi = {
  findSeriesById: async (imdbId: string): Promise<FindSeriesById | null> => {
    const {data} = await instance.get(`/find/${imdbId}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        external_source: 'imdb_id',
      },
    });

    const {tv_results: tvResults} = data;

    if (tvResults.length) {
      return tvResults[0];
    }

    return null;
  },

  findMovieById: async (imdbId: string): Promise<FindSeriesById | null> => {
    const {data} = await instance.get(`/find/${imdbId}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        external_source: 'imdb_id',
      },
    });

    const {movie_results: movieResults} = data;

    if (movieResults.length) {
      return movieResults[0];
    }

    return null;
  },
};

export default moviedbApi;
