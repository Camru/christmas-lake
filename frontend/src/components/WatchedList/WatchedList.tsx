import {useQuery} from '@tanstack/react-query';
import greenlightApi from '../../api/greenlightApi';
import {REACT_QUERY_API_KEYS, WatchedMediaEntity} from '../../types/types';
import WatchedItem from '../WatchedItem/WatchedItem';

import './WatchedList.css';

const WatchedList = (): JSX.Element => {
  const fetchWatchedMediaQuery = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.WATCHED],
    queryFn: greenlightApi.fetchWatchedMedia,
    retry: false,
  });

  const renderWatchedList = () => {
    if (fetchWatchedMediaQuery.isInitialLoading) {
      return <h1>loading...</h1>;
    }

    if (fetchWatchedMediaQuery.isError) {
      return <h1 style={{color: 'red'}}>Error fetching movies</h1>;
    }

    if (
      fetchWatchedMediaQuery.isSuccess &&
      !fetchWatchedMediaQuery.data.length
    ) {
      return <h1>No movies found</h1>;
    }

    console.log(
      '[cam] fetchWatchedMediaQuery.data',
      fetchWatchedMediaQuery.data
    );
    return fetchWatchedMediaQuery.data?.map((item: WatchedMediaEntity) => {
      return <WatchedItem key={item.imdbID} item={item} />;
    });
  };

  return <div className="movie-list">{renderWatchedList()}</div>;
};

export default WatchedList;
