import {useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import greenlightApi from '../../api/greenlightApi';
import omdbApi from '../../api/omdbApi';
import {
  ButtonColor,
  REACT_QUERY_API_KEYS,
  SearchResult,
} from '../../types/types';
import AddToWatchButton from '../AddButtons/AddToWatchButton';
import AddWatchedButton from '../AddButtons/AddWatchedButton';
import Box from '../Shared/Box/Box';
import IconButton from '../Shared/Button/IconButton';
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

  const fetchToWatchMedia = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.TO_WATCH],
    queryFn: greenlightApi.fetchToWatchMedia,
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
    if (fetchToWatchMedia.isLoading || !fetchToWatchMedia.data) {
      return false;
    }

    return fetchToWatchMedia.data.some(({imdbID: watchedImdbId, watched}) => {
      return imdbId === watchedImdbId && !watched;
    });
  };

  const renderFoundItems = (item: SearchResult) => {
    return (
      <Box key={item.imdbID} className="media-card" flexDirection="column">
        <img
          className="media-card-img"
          src={item.Poster}
          alt="media-thumbnail"
        />
        <Box className="media-card-contents" flexDirection="column">
          <Box className="media-card-header" justifyContent="space-between">
            <div>{item.Title}</div>
            <div>{item.Year}</div>
            <div>{item.Type}</div>
          </Box>
          <Box className="media-card-footer">
            <Box gap={10}>
              <AddWatchedButton
                item={item}
                isAlreadyAdded={getIsAlreadyWatched(item.imdbID)}
                isIconButton>
                <svg
                  width={17}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </AddWatchedButton>
              <AddToWatchButton
                item={item}
                isAlreadyAdded={getIsAlreadyAddedToWatchList(item.imdbID)}
                isIconButton>
                <svg
                  width={17}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </AddToWatchButton>
            </Box>
          </Box>
        </Box>
      </Box>
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
        <Box className="search-input" alignItems="center" position="relative">
          <input
            placeholder="search for a movie/show.."
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <IconButton onClick={handleSearch} color={ButtonColor.ACTION}>
            <svg
              width="17px"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </IconButton>
        </Box>
      </header>
      <Box gap={10} flexWrap="wrap">
        {renderSearchResults()}
      </Box>
    </div>
  );
};

export default Search;
