import {useQuery} from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import greenlightApi from '../../api/greenlightApi';
import { MEDIA_TYPE_PARAM } from '../../constants/url';
import {MediaType, REACT_QUERY_API_KEYS, MediaEntity} from '../../types/types';
import MediaCard from '../MediaCard/MediaCard';

import './MediaList.less';

const WatchedList = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const mediaTypeParam = searchParams.get(MEDIA_TYPE_PARAM) as MediaType;
  
  const fetchWatchedMediaQuery = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.WATCHED, mediaTypeParam],
    queryFn: () => {
      if (mediaTypeParam) {
        return greenlightApi.fetchWatchedMedia(mediaTypeParam);
      }

      return greenlightApi.fetchWatchedMedia();
    },
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

    return fetchWatchedMediaQuery.data?.map((item: MediaEntity) => {
      return <MediaCard key={item.imdbID} item={item} />;
    });
  };

  return <div className="media-card-list">{renderWatchedList()}</div>;
};

export default WatchedList;
