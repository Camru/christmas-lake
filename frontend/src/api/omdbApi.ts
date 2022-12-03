import axios from 'axios';
import {SearchResult, SearchResultByIdOrTitle} from '../types/types';
const API_KEY = '31cc9767';

const instance = axios.create({
  baseURL: `http://www.omdbapi.com/`,
});

const API_DELAY = 3000;
const waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms));

const omdbApi = {
  search: async (title: string): Promise<SearchResult[]> => {
    const {data} = await instance.get('/', {
      params: {
        apikey: API_KEY,
        s: title,
      },
    });

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
