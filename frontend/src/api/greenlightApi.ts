import axios from 'axios';
import { waitFor } from '../helpers/utils';
import {MediaType, WatchedMediaEntity} from '../types/types';

const instance = axios.create({
  baseURL: 'http://localhost:4000/v1/',
});

const API_DELAY = 3000;

export type CreateWatchedMediaParams = {
  title: string;
  dateWatched: string;
  mediaType: MediaType;
  thumbnail: string;
  imdbID: string;
  year: string;
  rating: string;
};

const greenlightApi = {
  fetchWatchedMedia: async (): Promise<WatchedMediaEntity[]> => {
    const {data} = await instance.get('movies');

    waitFor(API_DELAY);

    return data.media;
  },

  createWatchedMedia: async (
    params: CreateWatchedMediaParams
  ): Promise<WatchedMediaEntity> => {
    const {data} = await instance.post('movies', params);
    waitFor(API_DELAY);
    return data.media;
  },

  deleteMovie: async (movieId: string): Promise<string> => {
    const {data} = await instance.delete(`movies/${movieId}`);
    waitFor(API_DELAY);
    return data.message;
  },
};

export default greenlightApi;
