import axios from 'axios';
import {MediaType, MediaEntity, Tags} from '../types/types';

const instance = axios.create({
  baseURL: `http://192.168.0.110:4000/v1/`,
});

export type Rating = {
  Source: string;
  Value: string;
};

export type CreateWatchedMediaParams = {
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

export type UpdateMediaEntityParams = {
  dateWatched?: string;
  dateWatchedSeasons?: string[];
  tags?: string[];
  rating?: number;
};

type FetchMediaParams = {
  mediaType?: MediaType;
  sort?: string | null;
};

const greenlightApi = {
  fetchAllMedia: async (): Promise<MediaEntity[]> => {
    const {data} = await instance.get('movies');

    return data.media;
  },
  fetchWatchedMedia: async (
    params?: FetchMediaParams
  ): Promise<MediaEntity[]> => {
    const {data} = await instance.get('movies', {
      params: {
        watched: true,
        ...params,
      },
    });

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

    return data.media;
  },

  createWatchedMedia: async (
    params: CreateWatchedMediaParams
  ): Promise<MediaEntity> => {
    const {data} = await instance.post('movies', params);
    return data.media;
  },

  updateWatchedMedia: async ({
    mediaEntityId,
    params,
  }: {
    mediaEntityId: string;
    params: UpdateMediaEntityParams;
  }): Promise<MediaEntity> => {
    const {data} = await instance.put(`movies/${mediaEntityId}`, params);
    return data.media;
  },

  deleteMovie: async (movieId: string): Promise<string> => {
    const {data} = await instance.delete(`movies/${movieId}`);
    return data.message;
  },
};

export default greenlightApi;
