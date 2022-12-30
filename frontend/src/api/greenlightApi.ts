import axios from 'axios';
import {waitFor} from '../helpers/utils';
import {MediaType, MediaEntity} from '../types/types';

const instance = axios.create({
  baseURL: 'http://localhost:4000/v1/',
});

const API_DELAY = 3000;

export type CreateWatchedMediaParams = {
  title: string;
  datewatched: string;
  mediatype: MediaType;
  thumbnail: string;
  imdbid: string;
  year: string;
  rating: string;
  watched: boolean;
};

export type UpdateWatchedMediaParams = {
  dateWatched: string;
  rating: string;
};

type FetchMediaParams = {
  mediaType?: MediaType;
  sort?: string | null;
};

const greenlightApi = {
  fetchAllMedia: async (): Promise<MediaEntity[]> => {
    const {data} = await instance.get('movies');

    waitFor(API_DELAY);

    return data.media;
  },
  fetchWatchedMedia: async (
    params: FetchMediaParams
  ): Promise<MediaEntity[]> => {
    const {data} = await instance.get('movies', {
      params: {
        watched: true,
        ...params,
      },
    });

    waitFor(API_DELAY);

    return data.media;
  },
  fetchToWatchMedia: async (
    params?: FetchMediaParams
  ): Promise<MediaEntity[]> => {
    const {data} = await instance.get('movies', {
      params: {
        watched: false,
        ...params,
      },
    });

    waitFor(API_DELAY);

    return data.media;
  },

  createWatchedMedia: async (
    params: CreateWatchedMediaParams
  ): Promise<MediaEntity> => {
    const {data} = await instance.post('movies', params);
    waitFor(API_DELAY);
    return data.media;
  },

  updateWatchedMedia: async ({
    mediaEntityId,
    params,
  }: {
    mediaEntityId: string;
    params: UpdateWatchedMediaParams;
  }): Promise<MediaEntity> => {
    const {data} = await instance.put(`movies/${mediaEntityId}`, params);
    waitFor(API_DELAY);
    console.log('[cam] data', data);
    return data.media;
  },

  deleteMovie: async (movieId: string): Promise<string> => {
    const {data} = await instance.delete(`movies/${movieId}`);
    waitFor(API_DELAY);
    return data.message;
  },
};

export default greenlightApi;
