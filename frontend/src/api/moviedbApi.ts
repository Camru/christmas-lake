import axios from 'axios';
import {SearchResult, SearchResultByIdOrTitle} from '../types/types';
const API_KEY = '31cc9767';

const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
});

const omdbApi = {
  searchById: async (id: string): Promise<SearchResultByIdOrTitle> => {
    const {data} = await instance.get('/', {
      params: {
        apikey: API_KEY,
        i: id,
      },
    });

    return data.Search;
  },
};

export default omdbApi;
