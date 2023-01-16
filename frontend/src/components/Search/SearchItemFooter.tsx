import {useQuery} from '@tanstack/react-query';
import omdbApi from '../../api/omdbApi';
import {
  MediaRating,
  RatingSource,
  REACT_QUERY_API_KEYS,
  SearchResult,
} from '../../types/types';
import AddToWatchButton from '../Shared/Button/AddToWatchButton';
import Box from '../Shared/Box/Box';
import Rating from '../Shared/Rating/Rating';
import AddWatchedButton from '../Shared/Button/AddWatchedButton';
import {PlusIcon, CheckIcon} from '@heroicons/react/24/outline';

type SearchItemFooterProps = {
  item: SearchResult;
  watchedMediaEntityId: string | undefined;
  toWatchMediaEntityId: string | undefined;
};

//TODO: [cam] consolidate this with ToWatchFooter
const RatingSourceToKeyMap: Record<string, RatingSource> = {
  'Internet Movie Database': RatingSource.IMDB,
  'Rotten Tomatoes': RatingSource.ROTTEN_TOMATOES,
  Metacritic: RatingSource.METACRITIC,
};

const SearchItemFooter = ({
  item,
  watchedMediaEntityId,
  toWatchMediaEntityId,
}: SearchItemFooterProps) => {
  const searchedByIdQuery = useQuery({
    queryKey: [REACT_QUERY_API_KEYS.OMDB_SEARCH_BY_ID, item.Title],
    queryFn: () => omdbApi.searchByTitle(item.Title),
  });

  //TODO: [cam] consolidate this with ToWatchFooter
  const renderRatings = () => {
    const renderRating = (rating: MediaRating) => {
      return (
        <li key={rating.Source} className="rating">
          <Rating
            value={rating.Value}
            source={RatingSourceToKeyMap[rating.Source]}
          />
        </li>
      );
    };

    const ratings = searchedByIdQuery.data?.Ratings || [];

    return (
      <Box className="ratings-list">
        {ratings.length ? ratings.map(renderRating) : <p>No Ratings</p>}
      </Box>
    );
  };

  return (
    <Box width="100%" gap={10} alignItems="center" flexDirection="column">
      <Box width="100%" mt="10px">
        {renderRatings()}
      </Box>
      <Box width="100%" justifyContent="space-between" alignItems="center">
        <Box gap={7}>
          <AddToWatchButton
            className="search-footer"
            item={item}
            watchedMediaEntityId={watchedMediaEntityId}
            toWatchMediaEntityId={toWatchMediaEntityId}
            isIconButton
            ratings={searchedByIdQuery.data?.Ratings || []}>
            <PlusIcon className="button-icon search-footer" strokeWidth={2.5} />
          </AddToWatchButton>
          <AddWatchedButton
            className="search-footer"
            item={item}
            watchedMediaEntityId={watchedMediaEntityId}
            toWatchMediaEntityId={toWatchMediaEntityId}
            isIconButton>
            <CheckIcon className="button-icon search-footer" strokeWidth={2.5} />
          </AddWatchedButton>
        </Box>
        <div style={{textTransform: 'capitalize'}}>{item.Type}</div>
        <div>{item.Year}</div>
      </Box>
    </Box>
  );
};

export default SearchItemFooter;
