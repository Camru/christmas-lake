import {useQuery} from '@tanstack/react-query';
import {useSearchParams} from 'react-router-dom';
import greenlightApi from '../../api/greenlightApi';
import {MEDIA_TYPE_PARAM} from '../../constants/url';
import {MediaType, REACT_QUERY_API_KEYS, MediaEntity} from '../../types/types';
import MediaCard from '../MediaCard/MediaCard';

import './MediaList.less';

const ToWatchList = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const mediaTypeParam = searchParams.get(MEDIA_TYPE_PARAM) as MediaType;

  const fetchToWatchMedia = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.WATCHED, mediaTypeParam],
    queryFn: () => {
      if (mediaTypeParam) {
        return greenlightApi.fetchToWatchMedia(mediaTypeParam);
      }

      return greenlightApi.fetchToWatchMedia();
    },
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
    return fetchToWatchMedia.data?.map((item: MediaEntity) => {
      return <MediaCard key={item.imdbID} item={item} />;
    });
  };

  return <div className="media-card-list">{renderToWatchList()}</div>;
};

export default ToWatchList;
