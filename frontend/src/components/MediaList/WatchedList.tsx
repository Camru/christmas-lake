import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useSearchParams} from 'react-router-dom';
import greenlightApi from '../../api/greenlightApi';
import {getFilteredMediaEntities} from '../../helpers/utils';
import {
  MediaType,
  REACT_QUERY_API_KEYS,
  MediaEntity,
  RatingSource,
  ButtonColor,
  SearchParam,
} from '../../types/types';
import MediaCard from '../MediaCard/MediaCard';
import Box from '../Shared/Box/Box';
import IconButton from '../Shared/Button/IconButton';
import Rating from '../Shared/Rating/Rating';

import './MediaList.less';

const WatchedList = (): JSX.Element => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const mediaTypeParam = searchParams.get(SearchParam.MEDIA_TYPE) as MediaType;
  const sortParam = searchParams.get(SearchParam.SORT);

  const fetchWatchedMediaQuery = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.WATCHED, mediaTypeParam, sortParam],
    queryFn: () => {
      return greenlightApi.fetchWatchedMedia({
        mediaType: mediaTypeParam,
        sort: sortParam,
      });
    },
    retry: false,
  });

  const deleteMovieMutation = useMutation({
    mutationFn: greenlightApi.deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries([REACT_QUERY_API_KEYS.WATCHED]);
    },
  });

  const handleDeleteMovie = (movieId: string) => {
    deleteMovieMutation.mutate(movieId);
  };

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

    const filteredItems = (): MediaEntity[] => {
      if (!fetchWatchedMediaQuery.data) {
        return [];
      }

      return getFilteredMediaEntities(
        fetchWatchedMediaQuery.data,
        searchParams
      );
    };

    return filteredItems().map((item: MediaEntity) => {
      return (
        <MediaCard key={item.imdbID} item={item}>
          <Box justifyContent="space-between" width="100%">
            <Rating
              value={item.rating}
              source={RatingSource.ROTTEN_TOMATOES}
              type="float"
            />
            <IconButton
              onClick={() => handleDeleteMovie(item.id.toString())}
              color={ButtonColor.DANGER}>
              Del
            </IconButton>
          </Box>
        </MediaCard>
      );
    });
  };

  return <div className="media-card-list">{renderWatchedList()}</div>;
};

export default WatchedList;
