import {useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import greenlightApi, {CreateWatchedMediaParams} from '../../api/greenlightApi';
import omdbApi from '../../api/omdbApi';
import {REACT_QUERY_API_KEYS, SearchResult} from '../../types/types';
import AddWatchedButton from '../AddButtons/AddWatchedButton';
import Button from '../Button/Button';
import './Search.less';

const Search = () => {
  const [currentSearch, setCurrentSearch] = useState('');

  const {data, isFetching, refetch} = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.OMDB_SEARCH],
    queryFn: () => omdbApi.search(currentSearch),
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const fetchWatchedMediaQuery = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.WATCHED],
    queryFn: greenlightApi.fetchWatchedMedia,
    retry: false,
  });

  const handleSearch = () => {
    refetch();
  };

  const handleChange = (e: any) => {
    setCurrentSearch(e.target.value);
  };

  const renderSearchResults = () => {
    if (isFetching) {
      return <p>loading..</p>;
    }

    if (!data?.length) {
      return <p>No results found</p>;
    }

    return data.map(renderFoundItems);
  };

  const getIsAlreadyWatched = (imdbId: string) => {
    if (fetchWatchedMediaQuery.isLoading || !fetchWatchedMediaQuery.data) {
      return false;
    }

    return fetchWatchedMediaQuery.data.some(({imdbID: watchedImdbId}) => {
      return imdbId === watchedImdbId;
    });
  };

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
        <AddWatchedButton
          item={convertToMediaEntity(searchResult)}
          isAlreadyWatched={getIsAlreadyWatched(searchResult.imdbID)}>
          + Watched
        </AddWatchedButton>
      </div>
    );
  };

  const handleKeyDown = (e: any) => {
    if (e.code === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search">
      <header>
        <h1>Search</h1>
        <input
          placeholder="search for a movie/show.."
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleSearch}>Search</Button>
      </header>
      <div className="search-results">{renderSearchResults()}</div>
    </div>
  );
};

export default Search;
