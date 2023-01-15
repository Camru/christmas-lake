import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import {useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import greenlightApi from '../../api/greenlightApi';
import omdbApi from '../../api/omdbApi';
import {Colors, REACT_QUERY_API_KEYS, SearchResult} from '../../types/types';
import MediaCard from '../MediaCard/MediaCard';
import Box from '../Shared/Box/Box';
import IconButton from '../Shared/Button/IconButton';
import './Search.less';
import SearchItemFooter from './SearchItemFooter';

//TODO: [cam] Move search to the action bar and just display what list it's
// already added to in the media card

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
    queryFn: () => greenlightApi.fetchWatchedMedia(),
    retry: false,
  });

  const fetchToWatchMedia = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.TO_WATCH],
    queryFn: () => greenlightApi.fetchToWatchMedia(),
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

  const getWatchedMediaEntityId = (imdbId: string): string | undefined => {
    if (fetchWatchedMediaQuery.isLoading || !fetchWatchedMediaQuery.data) {
      return undefined;
    }

    const match = fetchWatchedMediaQuery.data?.find(
      ({imdbID: watchedImdbId, watched}) => {
        return watchedImdbId === imdbId && watched;
      }
    );

    return match?.id;
  };

  //TODO: [cam] allow reversing the action by removing it once you add it
  const getToWatchMediaEntityId = (imdbId: string): string | undefined => {
    if (fetchToWatchMedia.isLoading || !fetchToWatchMedia.data) {
      return undefined;
    }

    const match = fetchToWatchMedia.data.find(
      ({imdbID: watchedImdbId, watched}) => {
        return watchedImdbId === imdbId && !watched;
      }
    );

    return match?.id;
  };

  //TODO: [cam]  add footer component that fetches the ratings
  const renderFoundItems = (item: SearchResult) => {
    return (
      <MediaCard
        key={item.imdbID}
        id={item.imdbID}
        title={item.Title}
        thumbnail={item.Poster}>
        <SearchItemFooter
          item={item}
          watchedMediaEntityId={getWatchedMediaEntityId(item.imdbID)}
          toWatchMediaEntityId={getToWatchMediaEntityId(item.imdbID)}
        />
      </MediaCard>
    );
  };

  const handleKeyDown = (e: any) => {
    if (e.code === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box flexDirection="column">
      <Box p="20px 0 25px 0">
        <h1 style={{fontSize: 24, margin: 0, marginRight: 'auto'}}>Search</h1>
        <Box className="search-input" alignItems="center" position="relative">
          <input
            placeholder="Search for a movie/show.."
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <IconButton onClick={handleSearch} color={Colors.LIGHT}>
            <MagnifyingGlassIcon className="button-icon" />
          </IconButton>
        </Box>
      </Box>
      <div className="media-card-list">{renderSearchResults()}</div>
    </Box>
  );
};

export default Search;
