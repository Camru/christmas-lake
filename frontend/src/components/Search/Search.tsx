import {useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import {CreateWatchedMediaParams} from '../../api/greenlightApi';
import omdbApi from '../../api/omdbApi';
import {
  MediaEntity,
  REACT_QUERY_API_KEYS,
  SearchResult,
  WatchedMediaEntity,
} from '../../types/types';
import AddWatchedButton from '../AddButtons/AddWatchedButton';
import Button from '../Button/Button';
import './Search.css';

const Search = () => {
  const [currentSearch, setCurrentSearch] = useState('');

  const {data, isFetching, refetch} = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.OMDB_SEARCH],
    queryFn: () => omdbApi.search(currentSearch),
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const handleChange = (e: any) => {
    setCurrentSearch(e.target.value);
  };
  const handleSearch = () => {
    refetch();
  };

  // Poster: 'https://m.media-amazon.com/images/M/MV5BNTNkMTg4YmEtNWViZS00NGMwLWIwYmItMGVmYjU1ZTY1ZGYyXkEyXkFqcGdeQXVyMzA5MTg1Mzc@._V1_SX300.jpg';
  // Title: "The Test: A New Era for Australia's Team";
  // Type: 'series';
  // Year: '2020';
  // imdbID: 'tt11347692';

  const convertToMediaEntity = (
    item: SearchResult
  ): CreateWatchedMediaParams => {
    return {
      title: item.Title,
      dateWatched: new Date().toISOString(),
      year: item.Year,
      mediaType: item.Type,
      thumbnail: item.Poster,
      imdbID: item.imdbID,
      rating: '8.0/10.0',
    };
  };

  const renderFoundItems = (searchResult: SearchResult) => {
    return (
      <div key={searchResult.imdbID} className="search-result-item">
        <img src={searchResult.Poster} alt="poster" />
        <h2>{searchResult.Title}</h2>
        <p>Year: {searchResult.Year}</p>
        <p>Type: {searchResult.Type}</p>
        <AddWatchedButton item={convertToMediaEntity(searchResult)}>
          + Watched
        </AddWatchedButton>
      </div>
    );
  };

  const renderSearchResults = () => {
    if (isFetching) {
      return <p>loading..</p>;
    }

    if (!data?.length) {
      return <p>No results found</p>;
    }

    console.log('[cam] data', data);

    return data.map(renderFoundItems);
  };

  return (
    <div className="search">
      <header>
        <h1>Search</h1>
        <input
          placeholder="search for a movie/show.."
          onChange={handleChange}
        />
        <Button onClick={handleSearch}>Search</Button>
      </header>
      <div className="search-results">{renderSearchResults()}</div>
    </div>
  );
};

export default Search;
