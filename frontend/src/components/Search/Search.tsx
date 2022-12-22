import {useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import greenlightApi from '../../api/greenlightApi';
import omdbApi from '../../api/omdbApi';
import {REACT_QUERY_API_KEYS, SearchResult} from '../../types/types';
import AddToWatchButton from '../AddButtons/AddToWatchButton';
import AddWatchedButton from '../AddButtons/AddWatchedButton';
import Box from '../Shared/Box/Box';
import Button from '../Shared/Button/Button';
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

    return fetchWatchedMediaQuery.data.some(
      ({imdbID: watchedImdbId, watched}) => {
        return imdbId === watchedImdbId && watched;
      }
    );
  };

  const getIsAlreadyAddedToWatchList = (imdbId: string) => {
    if (fetchWatchedMediaQuery.isLoading || !fetchWatchedMediaQuery.data) {
      return false;
    }

    return fetchWatchedMediaQuery.data.some(
      ({imdbID: watchedImdbId, watched}) => {
        return imdbId === watchedImdbId && !watched;
      }
    );
  };

  const renderFoundItems = (searchResult: SearchResult) => {
    return (
      <div key={searchResult.imdbID} className="search-result-item">
        <img src={searchResult.Poster} alt="poster" />
        <h2>{searchResult.Title}</h2>
        <p>Year: {searchResult.Year}</p>
        <p>Type: {searchResult.Type}</p>
        <Box gap={10}>
          <AddWatchedButton
            item={searchResult}
            isAlreadyAdded={getIsAlreadyWatched(searchResult.imdbID)}>
            + Watched
          </AddWatchedButton>
          <AddToWatchButton
            item={searchResult}
            isAlreadyAdded={getIsAlreadyAddedToWatchList(searchResult.imdbID)}>
            + To Watch
          </AddToWatchButton>
        </Box>
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
