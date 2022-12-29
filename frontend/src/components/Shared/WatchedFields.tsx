import {RatingSource} from '../../types/types';
import Box from './Box/Box';
import Rating from './Rating/Rating';

type WatchedItemProps = {
  userRating: string;
  dateWatched: string;
  ratingChangeHandler: (value: string) => void;
  dateChangeHandler: (value: string) => void;
};

const WatchedFields = ({
  userRating,
  dateWatched,
  ratingChangeHandler,
  dateChangeHandler,
}: WatchedItemProps) => {
  return (
    <Box flexDirection="column" gap={10} width="100%">
      <input
        type="date"
        onChange={(e: any) => dateChangeHandler(e.target.value)}
        value={dateWatched}
      />
      <Box justifyContent="space-between" width="100%" gap={10}>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={userRating}
          onChange={(e: any) => ratingChangeHandler(e.target.value)}
          style={{width: '100%'}}
        />
        <div
          style={{
            width: '30px',
            display: 'flex',
            alignItems: 'center',
          }}>
          <Rating
            value={userRating}
            source={RatingSource.ROTTEN_TOMATOES}
            type="float"
          />
        </div>
      </Box>
    </Box>
  );
};

export default WatchedFields;
