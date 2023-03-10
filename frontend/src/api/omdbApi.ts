import axios from 'axios';
import {SearchResult, SearchResultByIdOrTitle} from '../types/types';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const instance = axios.create({
  baseURL: `https://www.omdbapi.com/`,
});

const omdbApi = {
  search: async (title: string): Promise<SearchResult[]> => {
    const {data} = await instance.get('/', {
      params: {
        apikey: API_KEY,
        s: title,
      },
    });

    if (data.Error) {
      return [];
    }

    return data.Search;
  },

  searchById: async (id: string): Promise<SearchResultByIdOrTitle> => {
    const {data} = await instance.get('/', {
      params: {
        apikey: API_KEY,
        i: id,
      },
    });

    return data.Search;
  },

  searchByTitle: async (title: string): Promise<SearchResultByIdOrTitle> => {
    const {data} = await instance.get('/', {
      params: {
        apikey: API_KEY,
        t: title,
      },
    });

    return data;
  },
};

export default omdbApi;
