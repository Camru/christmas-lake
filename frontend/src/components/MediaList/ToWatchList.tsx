import {useQuery} from '@tanstack/react-query';
import {useSearchParams} from 'react-router-dom';
import greenlightApi from '../../api/greenlightApi';
import {getFilteredMediaEntities} from '../../helpers/utils';
import {
  MediaType,
  REACT_QUERY_API_KEYS,
  MediaEntity,
  SearchParam,
} from '../../types/types';
import {
  CLIENT_SORT_OPTIONS,
  DEFAULT_SORT_OPTIONS,
} from '../ActionBar/ActionBar';
import MediaCard from '../MediaCard/MediaCard';
import ToWatchFooter from '../MediaCard/ToWatchFooter';
import Box from '../Shared/Box/Box';

import './MediaList.less';

const ToWatchList = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const mediaTypeParam = searchParams.get(SearchParam.MEDIA_TYPE) as MediaType;
  const sortParam = searchParams.get(SearchParam.SORT);

  const isClientSortOption = CLIENT_SORT_OPTIONS.some(({value}) => {
    return value === sortParam?.replace('-', '');
  });

  const fetchToWatchMedia = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.TO_WATCH, mediaTypeParam, sortParam],
    queryFn: () => {
      return greenlightApi.fetchToWatchMedia({
        mediaType: mediaTypeParam,
        sort: isClientSortOption ? DEFAULT_SORT_OPTIONS[0].value : sortParam,
      });
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

    const filteredItems = (): MediaEntity[] => {
      if (!fetchToWatchMedia.data) {
        return [];
      }

      return getFilteredMediaEntities(fetchToWatchMedia.data, searchParams);
    };

    return filteredItems().map((item: MediaEntity) => {
      return (
        <MediaCard key={item.imdbID} item={item}>
          <ToWatchFooter item={item} />
        </MediaCard>
      );
    });
  };

  return (
    <Box flexDirection="column">
      <div className="media-card-list">{renderToWatchList()}</div>
    </Box>
  );
};

export default ToWatchList;
