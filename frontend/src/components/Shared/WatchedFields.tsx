import {PlusIcon, XMarkIcon} from '@heroicons/react/24/solid';
import {useEffect} from 'react';
import {getCurrentDateInputValue} from '../../helpers/utils';
import {RatingSource} from '../../types/types';
import Box from './Box/Box';
import IconButton from './Button/IconButton';
import Rating from './Rating/Rating';
import {TooltipPosition} from './Tooltip/Tooltip';

type WatchedItemProps = {
  userRating: string;
  dateWatched: string;
  dateWatchedSeasons?: string[];
  ratingChangeHandler: (value: string) => void;
  dateChangeHandler: (dateWatched: string) => void;
  seasonDateChangeHandler?: (
    dateWatched: string | null,
    seasonNumber: number
  ) => void;
  isSeries?: boolean;
};

const WatchedFields = ({
  userRating,
  dateWatched,
  dateWatchedSeasons,
  ratingChangeHandler,
  dateChangeHandler,
  seasonDateChangeHandler,
  isSeries,
}: WatchedItemProps) => {
  useEffect(() => {
    if (isSeries && seasonDateChangeHandler && dateWatchedSeasons?.length) {
      dateWatchedSeasons.forEach((dateWatchedSeason, index) => {
        seasonDateChangeHandler(dateWatchedSeason, index);
      });
    }
  }, []);
  const renderAddSeasonButton = () => {
    if (!seasonDateChangeHandler) return null;
    return (
      <IconButton
        tooltip={{
          text: 'Add season',
          position: TooltipPosition.RIGHT,
        }}
        onClick={() =>
          seasonDateChangeHandler(
            getCurrentDateInputValue(),
            dateWatchedSeasons?.length || 0
          )
        }
        style={{marginLeft: 'auto'}}>
        <PlusIcon className="button-icon" />
      </IconButton>
    );
  };
  const renderSeriesFields = () => {
    if (!seasonDateChangeHandler) {
      return null;
    }

    return (dateWatchedSeasons || []).map((dateSeasonWatched, index) => {
      const isLastItem = index + 1 === dateWatchedSeasons?.length;
      return (
        <Box key={`${dateSeasonWatched}-${index}`} alignItems="center" gap={20}>
          <p style={{whiteSpace: 'nowrap', fontSize: 14}}>Season {index + 1}</p>
          <Box alignItems="center" gap={5}>
            <input
              className="date-picker-input"
              type="date"
              onChange={(e: any) => {
                if (!seasonDateChangeHandler) return;
                seasonDateChangeHandler(e.target.value, index);
              }}
              value={dateSeasonWatched}
            />
            {index !== 0 && isLastItem && (
              <IconButton
                tooltip={{
                  text: 'Remove season',
                  position: TooltipPosition.RIGHT,
                }}
                onClick={() => {
                  seasonDateChangeHandler(null, index);
                }}>
                <XMarkIcon className="button-icon" />
              </IconButton>
            )}
          </Box>
          {isLastItem && renderAddSeasonButton()}
        </Box>
      );
    });
  };

  return (
    <Box flexDirection="column" gap={25} mt={15} width="100%">
      {isSeries ? (
        renderSeriesFields()
      ) : (
        <input
          className="date-picker-input"
          type="date"
          onChange={(e: any) => dateChangeHandler(e.target.value)}
          value={dateWatched}
        />
      )}

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
            display: 'flex',
            alignItems: 'center',
            width: '90px',
          }}>
          <Rating
            value={userRating}
            source={RatingSource.USER_RATING}
            type="float"
          />
        </div>
      </Box>
    </Box>
  );
};

export default WatchedFields;
