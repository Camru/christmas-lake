import {useQuery} from '@tanstack/react-query';
import greenlightApi from '../../../api/greenlightApi';
import {REACT_QUERY_API_KEYS, WatchedMediaEntity} from '../../../types/types';
import ToWatchItem from '../ToWatchItem/ToWatchItem';

import './ToWatchList.less';

const ToWatchList = (): JSX.Element => {
  const fetchToWatchMedia = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.WATCHED],
    queryFn: greenlightApi.fetchToWatchMedia,
    retry: false,
  });

  const renderToWatchList = () => {
    if (fetchToWatchMedia.isInitialLoading) {
      return <h1>loading...</h1>;
    }

    if (fetchToWatchMedia.isError) {
      return <h1 style={{color: 'red'}}>Error fetching movies</h1>;
    }

    if (fetchToWatchMedia.isSuccess && !fetchToWatchMedia.data.length) {
      return <h1>No movies found</h1>;
    }

    //TODO: [cam]  Use correct component <ToWatchItem /> and type
    return fetchToWatchMedia.data?.map((item: WatchedMediaEntity) => {
      return <ToWatchItem key={item.imdbID} item={item} />;
    });
  };

  return <div className="watched-list">{renderToWatchList()}</div>;
};

export default ToWatchList;
