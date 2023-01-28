import {useQuery} from '@tanstack/react-query';
import {useSearchParams} from 'react-router-dom';
import greenlightApi, {Rating} from '../../api/greenlightApi';
import {getFilteredMediaEntities} from '../../helpers/utils';
import {
  MediaType,
  REACT_QUERY_API_KEYS,
  MediaEntity,
  SearchParam,
  RatingSourceSortParam,
  RatingSource,
} from '../../types/types';
import {
  CLIENT_SORT_OPTIONS,
  DEFAULT_SORT_OPTIONS,
} from '../ActionBar/ActionBar';
import MediaCard from '../MediaCard/MediaCard';
import ToWatchFooter from '../MediaCard/ToWatchFooter';
import Box from '../Shared/Box/Box';
import EmptyData from '../Shared/EmptyData/EmptyData';
import FilterSummary from '../Shared/FilterSummary/FilterSummary';

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

  const convertRatingToFloat = (rating: string, ratingSource: RatingSource) => {
    const converters = {
      [RatingSource.ROTTEN_TOMATOES]: (value: string) => parseInt(value),
      [RatingSource.IMDB]: (value: string) => +value.split('/')[0],
    };

    return converters[ratingSource as keyof typeof converters](rating);
  };

  //TODO: [cam] add default sort direction by sort param (i.e. desc for ratings)
  function sortByRatings(array: MediaEntity[], ratingSource: RatingSource) {
    return array.slice().sort((a: any, b: any) => {
      const ratingsA = JSON.parse(a.ratings);
      const ratingsB = JSON.parse(b.ratings);

      const ratingA = ratingsA.find((r: Rating) => r.Source === ratingSource);
      const ratingB = ratingsB.find((r: Rating) => r.Source === ratingSource);

      if (!ratingA && !ratingB) {
        return 0;
      }

      if (!ratingA) {
        return -1;
      }

      if (!ratingB) {
        return 1;
      }

      const ratingAInt = convertRatingToFloat(ratingA.Value, ratingSource);
      const ratingBInt = convertRatingToFloat(ratingB.Value, ratingSource);

      return ratingAInt - ratingBInt;
    });
  }

  const getFilteredItems = (): MediaEntity[] => {
    if (!fetchToWatchMedia.data) {
      return [];
    }

    const filteredItems = getFilteredMediaEntities(
      fetchToWatchMedia.data,
      searchParams
    );

    if (isClientSortOption) {
      if (sortParam?.includes(RatingSourceSortParam.ROTTEN_TOMATOES)) {
        if (sortParam.startsWith('-')) {
          return sortByRatings(
            filteredItems,
            RatingSource.ROTTEN_TOMATOES
          ).reverse();
        } else {
          return sortByRatings(filteredItems, RatingSource.ROTTEN_TOMATOES);
        }
      }

      if (sortParam?.includes(RatingSourceSortParam.IMDB)) {
        if (sortParam.startsWith('-')) {
          return sortByRatings(filteredItems, RatingSource.IMDB).reverse();
        } else {
          return sortByRatings(filteredItems, RatingSource.IMDB);
        }
      }
    }

    return filteredItems;
  };

  const filteredItems = getFilteredItems();

  const renderToWatchList = () => {
    if (fetchToWatchMedia.isInitialLoading) {
      return <h1>loading...</h1>;
    }

    if (fetchToWatchMedia.isError) {
      return <h1 style={{color: 'red'}}>Error fetching movies</h1>;
    }

    if (fetchToWatchMedia.isSuccess && !fetchToWatchMedia.data.length) {
      return <EmptyData mediaTypeParam={mediaTypeParam} />;
    }

    if (!filteredItems.length) {
      return <EmptyData mediaTypeParam={mediaTypeParam} />;
    }

    return filteredItems.map((item: MediaEntity) => {
      return (
        <MediaCard
          key={item.id}
          id={item.id}
          title={item.title}
          thumbnail={item.thumbnail}>
          <ToWatchFooter item={item} />
        </MediaCard>
      );
    });
  };

  return (
    <Box className="media-card-list-container" flexDirection="column">
      <FilterSummary
        totalFilteredItems={filteredItems.length}
        totalItems={fetchToWatchMedia.data?.length || 0}
      />
      <div className="media-card-list">{renderToWatchList()}</div>
    </Box>
  );
};

export default ToWatchList;
